package com.teamenergy.billocr.service.ocr;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.teamenergy.billocr.config.GeminiProperties;
import com.teamenergy.billocr.exception.OcrProcessingException;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import javax.imageio.ImageIO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

/**
 * Calls the Gemini API directly over REST (a plain API key from aistudio.google.com, not
 * Vertex AI / the official SDK) - same lightweight-REST-client pattern as
 * SupabaseStorageClient, and asks Gemini for plain transcribed text rather than structured
 * JSON, so BenecoBillParser's existing regex parsing keeps working unchanged. Swapping to
 * structured JSON output later is a real option, deliberately not done here to keep this a
 * contained, one-class change.
 */
@Component
public class GeminiOcrTextExtractor implements OcrTextExtractor {

    private static final String ENDPOINT_TEMPLATE =
        "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent";

    private static final String TRANSCRIBE_PROMPT =
        "Transcribe every piece of readable text in this image exactly as it appears, "
            + "preserving line breaks between fields. This is a utility bill. Output only "
            + "the raw transcribed text - no commentary, no explanation, no markdown formatting.";

    /**
     * Gemini doesn't expose a calibrated per-page confidence score the way traditional OCR
     * engines do. Rather than fabricate false precision, this is a fixed, clearly-labeled
     * placeholder - not a real measurement. Revisit if a genuine confidence signal is needed.
     */
    private static final double PLACEHOLDER_CONFIDENCE = 0.85;

    /**
     * 503 (model overloaded) and 429 (rate limited) are the only statuses worth retrying -
     * both are Google saying "try again shortly," observed for real in testing, not
     * speculative. Everything else (bad key, bad request, model not found) will fail the
     * same way every time, so retrying just delays a real error uselessly.
     */
    private static final int MAX_ATTEMPTS = 3;
    private static final long RETRY_BASE_DELAY_MS = 1500;

    private final RestClient restClient;
    private final GeminiProperties properties;
    private final PdfToImageConverter pdfToImageConverter;

    public GeminiOcrTextExtractor(
        RestClient.Builder builder,
        GeminiProperties properties,
        PdfToImageConverter pdfToImageConverter
    ) {
        this.restClient = builder.build();
        this.properties = properties;
        this.pdfToImageConverter = pdfToImageConverter;
    }

    @Override
    public OcrResult extractText(File file) {
        if (!properties.isConfigured()) {
            throw new OcrProcessingException("Gemini isn't configured (GEMINI_API_KEY not set)");
        }

        List<byte[]> pageImages = loadPageImagesAsBytes(file);

        StringBuilder combinedText = new StringBuilder();
        for (byte[] imageBytes : pageImages) {
            combinedText.append(callGemini(imageBytes)).append('\n');
        }

        return new OcrResult(combinedText.toString(), PLACEHOLDER_CONFIDENCE);
    }

    private List<byte[]> loadPageImagesAsBytes(File file) {
        String name = file.getName().toLowerCase();
        if (name.endsWith(".pdf")) {
            return pdfToImageConverter.toImages(file).stream()
                .map(this::toJpegBytes)
                .toList();
        }
        try {
            return List.of(Files.readAllBytes(file.toPath()));
        } catch (IOException e) {
            throw new OcrProcessingException("Failed to read file: " + file.getName(), e);
        }
    }

    private byte[] toJpegBytes(BufferedImage image) {
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ImageIO.write(image, "jpg", out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new OcrProcessingException("Failed to encode PDF page as image", e);
        }
    }

    private String callGemini(byte[] imageBytes) {
        String base64 = Base64.getEncoder().encodeToString(imageBytes);
        GenerateContentRequest request = new GenerateContentRequest(List.of(
            new Content(List.of(
                new Part(TRANSCRIBE_PROMPT, null),
                new Part(null, new InlineData("image/jpeg", base64))
            ))
        ));

        GenerateContentResponse response = callGeminiWithRetry(request);

        if (response == null || response.candidates() == null || response.candidates().isEmpty()) {
            throw new OcrProcessingException("Gemini returned an empty response");
        }

        return response.candidates().get(0).content().parts().stream()
            .map(Part::text)
            .filter(text -> text != null && !text.isBlank())
            .reduce("", (a, b) -> a + b);
    }

    private GenerateContentResponse callGeminiWithRetry(GenerateContentRequest request) {
        for (int attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
            try {
                return restClient.post()
                    .uri(ENDPOINT_TEMPLATE + "?key={key}", properties.model(), properties.apiKey())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(GenerateContentResponse.class);
            } catch (RestClientResponseException e) {
                boolean retryable = e.getStatusCode() == HttpStatus.SERVICE_UNAVAILABLE
                    || e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS;
                if (!retryable || attempt == MAX_ATTEMPTS) {
                    throw new OcrProcessingException(
                        "Gemini API call failed (" + e.getStatusCode() + "): " + e.getResponseBodyAsString(), e);
                }
                sleepBeforeRetry(attempt);
            } catch (RestClientException e) {
                throw new OcrProcessingException("Failed to call Gemini API: " + e.getMessage(), e);
            }
        }
        throw new OcrProcessingException("Gemini API call did not succeed after " + MAX_ATTEMPTS + " attempts");
    }

    private void sleepBeforeRetry(int attempt) {
        try {
            Thread.sleep(RETRY_BASE_DELAY_MS * attempt);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new OcrProcessingException("Interrupted while retrying Gemini API call", e);
        }
    }

    // Minimal request/response shape for the Gemini REST API - internal wire format only.
    private record GenerateContentRequest(List<Content> contents) {
    }

    private record Content(List<Part> parts) {
    }

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private record Part(String text, @JsonProperty("inline_data") InlineData inlineData) {
    }

    private record InlineData(@JsonProperty("mime_type") String mimeType, String data) {
    }

    private record GenerateContentResponse(List<Candidate> candidates) {
    }

    private record Candidate(Content content) {
    }
}

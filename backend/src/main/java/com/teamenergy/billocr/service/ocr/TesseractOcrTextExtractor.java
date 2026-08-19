package com.teamenergy.billocr.service.ocr;

import com.teamenergy.billocr.config.OcrProperties;
import com.teamenergy.billocr.exception.OcrProcessingException;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import javax.imageio.ImageIO;
import net.sourceforge.tess4j.ITessAPI;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.Word;
import org.springframework.stereotype.Component;

@Component
public class TesseractOcrTextExtractor implements OcrTextExtractor {

    private final Tesseract tesseract;
    private final PdfToImageConverter pdfToImageConverter;

    public TesseractOcrTextExtractor(OcrProperties ocrProperties, PdfToImageConverter pdfToImageConverter) {
        this.pdfToImageConverter = pdfToImageConverter;
        this.tesseract = new Tesseract();
        if (ocrProperties.tessdataPath() != null && !ocrProperties.tessdataPath().isBlank()) {
            tesseract.setDatapath(ocrProperties.tessdataPath());
        }
        tesseract.setLanguage(ocrProperties.language() != null ? ocrProperties.language() : "eng");
    }

    @Override
    public OcrResult extractText(File file) {
        List<BufferedImage> pages = loadPages(file);

        StringBuilder combinedText = new StringBuilder();
        double confidenceSum = 0;
        int confidenceCount = 0;

        for (BufferedImage page : pages) {
            try {
                // doOCR() keeps line breaks, which regex field parsing relies on;
                // getWords() is a second pass solely to compute an overall confidence score.
                combinedText.append(tesseract.doOCR(page)).append('\n');

                List<Word> words = tesseract.getWords(page, ITessAPI.TessPageIteratorLevel.RIL_WORD);
                for (Word word : words) {
                    confidenceSum += word.getConfidence();
                    confidenceCount++;
                }
            } catch (Exception e) {
                throw new OcrProcessingException("OCR engine failed to process " + file.getName(), e);
            }
        }

        double confidence = confidenceCount == 0 ? 0 : (confidenceSum / confidenceCount) / 100.0;
        return new OcrResult(combinedText.toString(), confidence);
    }

    private List<BufferedImage> loadPages(File file) {
        String name = file.getName().toLowerCase();
        if (name.endsWith(".pdf")) {
            return pdfToImageConverter.toImages(file);
        }
        try {
            BufferedImage image = ImageIO.read(file);
            if (image == null) {
                throw new OcrProcessingException("Unsupported or unreadable image file: " + file.getName());
            }
            List<BufferedImage> single = new ArrayList<>();
            single.add(image);
            return single;
        } catch (Exception e) {
            throw new OcrProcessingException("Failed to read image file: " + file.getName(), e);
        }
    }
}

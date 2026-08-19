package com.teamenergy.billocr.service.ocr;

import com.teamenergy.billocr.exception.OcrProcessingException;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

/** Picks a BillParser by scanning OCR text for a known provider name. */
@Component
public class ProviderDetector {

    private final Map<String, BillParser> parsersByProviderKey;

    public ProviderDetector(List<BillParser> parsers) {
        this.parsersByProviderKey = parsers.stream()
            .collect(Collectors.toMap(p -> p.providerKey().toUpperCase(Locale.ROOT), p -> p));
    }

    public BillParser detect(String rawText) {
        String upper = rawText.toUpperCase(Locale.ROOT);
        return parsersByProviderKey.values().stream()
            .filter(parser -> upper.contains(parser.providerKey().toUpperCase(Locale.ROOT)))
            .findFirst()
            .orElseThrow(() -> new OcrProcessingException(
                "Could not identify a known electricity provider (e.g. BENECO) in the uploaded bill. "
                    + "Please enter the bill details manually."));
    }
}

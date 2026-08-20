package com.teamenergy.billocr.service.ocr;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;

/**
 * OCR'd dates arrive in whatever format the provider prints, often with recognition noise.
 * Tries a handful of common bill formats and gives up to null rather than guessing wrong -
 * the frontend's validate step lets a human fill in anything this misses.
 */
final class LooseDateParser {

    private static final List<DateTimeFormatter> FORMATS = List.of(
        DateTimeFormatter.ofPattern("MMMM d, yyyy"),
        DateTimeFormatter.ofPattern("MMM d, yyyy"),
        DateTimeFormatter.ofPattern("MM/dd/yyyy"),
        DateTimeFormatter.ofPattern("M/d/yyyy"),
        DateTimeFormatter.ofPattern("yyyy-MM-dd"),
        // Real BENECO invoices print dates as MM-dd-yyyy (e.g. "06-30-2026") - confirmed
        // against an actual receipt photo, not assumed.
        DateTimeFormatter.ofPattern("MM-dd-yyyy")
    );

    private LooseDateParser() {
    }

    static LocalDate parse(String candidate) {
        if (candidate == null) {
            return null;
        }
        String cleaned = candidate.trim().replaceAll("\\s+", " ");
        for (DateTimeFormatter format : FORMATS) {
            try {
                return LocalDate.parse(cleaned, format);
            } catch (DateTimeParseException ignored) {
                // try the next format
            }
        }
        return null;
    }
}

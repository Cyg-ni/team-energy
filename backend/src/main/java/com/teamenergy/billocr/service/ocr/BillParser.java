package com.teamenergy.billocr.service.ocr;

import java.util.List;

public interface BillParser {

    /** Which provider name (case-insensitive) this parser handles, e.g. "BENECO". */
    String providerKey();

    /**
     * Text fragments that identify this provider in raw OCR output, checked case-insensitively.
     * Defaults to just providerKey(), but override when a provider's short name/logo isn't
     * reliably transcribable text on its own (e.g. an acronym embedded in a graphic) and the
     * bill's printed legal name needs to be matched too.
     */
    default List<String> detectionAliases() {
        return List.of(providerKey());
    }

    ParsedBillData parse(String rawText);
}

package com.teamenergy.billocr.service.ocr;

public interface BillParser {

    /** Which provider name (case-insensitive) this parser handles, e.g. "BENECO". */
    String providerKey();

    ParsedBillData parse(String rawText);
}

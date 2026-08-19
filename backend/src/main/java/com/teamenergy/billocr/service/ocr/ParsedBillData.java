package com.teamenergy.billocr.service.ocr;

import java.time.LocalDate;

/** What a BillParser pulls out of raw OCR text, before it's shown to the user for validation. */
public record ParsedBillData(
    String provider,
    String accountNumber,
    LocalDate billingDate,
    String billingPeriod,
    LocalDate dueDate,
    Double totalAmount,
    Double previousReading,
    Double currentReading,
    Double consumption
) {
}

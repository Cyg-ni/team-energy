package com.teamenergy.billocr.dto.response;

/** Response for POST /api/bills/extract — matches the frontend's mocked OCR shape field-for-field. */
public record BillExtractionResponse(
    String provider,
    String accountNumber,
    String billingDate,
    String billingPeriod,
    String dueDate,
    Double totalAmount,
    Double previousReading,
    Double currentReading,
    Double consumption,
    Double ocrConfidence,
    String documentReference
) {
}

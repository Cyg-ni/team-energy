package com.teamenergy.billocr.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDate;

/**
 * What the frontend submits from the "Validate Bill Information" step, after the
 * OCR-filled form has been reviewed (and possibly corrected) by a human.
 */
public record BillValidationRequest(

    @NotNull(message = "departmentId is required")
    Long departmentId,

    @NotBlank(message = "Provider is required")
    String provider,

    @NotBlank(message = "Account number is required")
    String accountNumber,

    @NotNull(message = "Billing date is required")
    LocalDate billingDate,

    @NotBlank(message = "Billing period is required")
    String billingPeriod,

    /** Not every provider prints one on the receipt (e.g. real BENECO bills seen so far don't) -
     * left null rather than forcing staff to fabricate a date the source document doesn't have. */
    LocalDate dueDate,

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be greater than zero")
    Double totalAmount,

    @NotNull(message = "Previous reading is required")
    @PositiveOrZero(message = "Reading cannot be negative")
    Double previousReading,

    @NotNull(message = "Current reading is required")
    @PositiveOrZero(message = "Reading cannot be negative")
    Double currentReading,

    @NotNull(message = "Consumption is required")
    @Positive(message = "Consumption must be greater than zero")
    Double consumption,

    /** Returned by POST /api/bills/extract; links this submission back to the stored file. */
    String documentReference,

    Boolean ocrExtracted,

    Double ocrConfidence
) {
}

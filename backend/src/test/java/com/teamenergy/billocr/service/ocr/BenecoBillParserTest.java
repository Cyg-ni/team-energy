package com.teamenergy.billocr.service.ocr;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class BenecoBillParserTest {

    private final BenecoBillParser parser = new BenecoBillParser();

    private static final String SAMPLE_BILL_TEXT = """
        BENECO Benguet Electric Cooperative
        Account Number: ACC-4521-8847-3
        Billing Date: August 1, 2026
        Billing Period: July 1 - July 31, 2026
        Due Date: August 15, 2026
        Previous Reading: 12450
        Present Reading: 12875
        Total Consumption: 425 kWh
        Total Amount Due: PHP 3,245.50
        """;

    @Test
    void parsesAllFieldsFromCleanBillText() {
        ParsedBillData result = parser.parse(SAMPLE_BILL_TEXT);

        assertEquals("BENECO", result.provider());
        assertEquals("ACC-4521-8847-3", result.accountNumber());
        assertEquals(LocalDate.of(2026, 8, 1), result.billingDate());
        assertEquals(LocalDate.of(2026, 8, 15), result.dueDate());
        assertEquals(3245.50, result.totalAmount());
        assertEquals(12450.0, result.previousReading());
        assertEquals(12875.0, result.currentReading());
        assertEquals(425.0, result.consumption());
    }

    @Test
    void fallsBackToReadingDifferenceWhenConsumptionLabelIsMissing() {
        String textWithoutConsumptionLabel = """
            BENECO
            Account Number: ACC-1111-2222-3
            Previous Reading: 100
            Present Reading: 175
            Total Amount Due: 1,000.00
            """;

        ParsedBillData result = parser.parse(textWithoutConsumptionLabel);

        assertNotNull(result.consumption());
        assertEquals(75.0, result.consumption());
    }
}

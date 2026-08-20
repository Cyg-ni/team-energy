package com.teamenergy.billocr.service.ocr;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

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

    /**
     * Reconstructed from Gemini's actual logged transcription of a real, physically photographed
     * BENECO receipt (server log, "OCR raw text for ..."), not invented - this is what real
     * BENECO bills look like: an unlabeled reading table, no "Billing Period"/"Previous Reading"
     * text anywhere. The trailing charges breakdown is genuine too, confirming TOTAL_AMOUNT's
     * label alternatives don't false-positive-match on line-item charges like "Distribution VAT".
     */
    private static final String REAL_RECEIPT_TEXT = """
        BENECO ELECTRIC COOPERATIVE
        MRBD Office #0920-916-0979
        Abatan CP No #0917-502-7514
        #0908-880-8691 / 0917 502 7500
        Baguio Telephone Nos.

        ACCOUNT NUMBER
        3114-0280-02-0
        BOOK NUMBER
        3114

        Name: KELLOGG ALBERT
        Tin No:
        Address: 20 AVELINO ST.
        Senior ID No:
        Meter No: 00101562    Mult: 1    Type: R

        DATE          READING           KWH USED
        06-30-2026    14878             75.00
        05-26-2026    14803

        Last Payment Date   : 06-05-2026
        Last Amount Paid    : 597.00

        Generatn System Chrge @ 6.7822  =  508.66
        REC RATE @ .0000  =  0.00
        Ancillary Charge @ .6110  =  45.82
        TRANSMISSION SYSTEM @ .4556  =  34.17
        SYSTEM LOSS CHARGE @ .6277  =  47.08
        DISTRIBUTION SYSTEM @ .4613  =  34.60
        Distribution VAT @ 12%  =  14.44
        """;

    @Test
    void parsesRealReceiptReadingTableWithoutAnyFieldLabels() {
        ParsedBillData result = parser.parse(REAL_RECEIPT_TEXT);

        assertEquals("BENECO", result.provider());
        assertEquals("3114-0280-02-0", result.accountNumber());
        assertEquals(LocalDate.of(2026, 6, 30), result.billingDate());
        assertEquals("05-26-2026 to 06-30-2026", result.billingPeriod());
        assertEquals(14803.0, result.previousReading());
        assertEquals(14878.0, result.currentReading());
        assertEquals(75.0, result.consumption());
        // Genuinely absent from this receipt layout (no "Due Date" text, and the total-amount
        // line was cut off in the source photo before it was reached) - stays honestly null
        // rather than false-matching a charges line like "Distribution VAT @ 12% = 14.44".
        assertNull(result.dueDate());
        assertNull(result.totalAmount());
    }

    /**
     * A second real BENECO receipt photo - fuller than REAL_RECEIPT_TEXT above, not cropped
     * before the totals/due-date section. Reproduces a real bug: this bill prints "AFTER DUE
     * DATE : 977.04" (a penalty amount, not a date) before the actual "DUE DATE FOR CURRENT
     * BILL : 07/10/2026" line, and the original regex matched the decoy first every time.
     */
    private static final String FULLER_RECEIPT_TEXT = """
        TOTAL AMOUNT IF PAID
        AFTER DUE DATE            :        977.04
        INCLUSIVE OF THE FOLLOWING:
        CURR BILL SRCHRG           :          87.86
        VAT OF CURR SRCHRG         :          10.54

        ACCOUNT NUMBER
        3114-0280-02-0

        DATE          READING           KWH USED
        06-30-2026    14878             75.00
        05-26-2026    14803

        CURRENT BILL                     :         878.99
        ADVANCE PAYMENT                  :          -0.35
        TOTAL AMOUNT DUE                 :         878.64

        DUE DATE FOR CURRENT BILL: 07/10/2026

        TOTAL AMOUNT IF PAID
        AFTER DUE DATE            :        977.04

        Last Payment Date   : 06-05-2026
        Last Amount Paid    : 597.00
        """;

    @Test
    void parsesRealDueDateWithoutFalseMatchingThePenaltyLineNamedAfterDueDate() {
        ParsedBillData result = parser.parse(FULLER_RECEIPT_TEXT);

        assertEquals(LocalDate.of(2026, 7, 10), result.dueDate());
        assertEquals(878.64, result.totalAmount());
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

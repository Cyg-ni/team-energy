package com.teamenergy.billocr.service.ocr;

import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/**
 * Label-anchored regex parsing for BENECO bills. Tuned against a real photographed BENECO
 * receipt (not hand-written sample text) as of the second pass on this file - see the
 * READING_TABLE pattern comment for what that real receipt actually looks like, which is
 * meaningfully different from a formal labeled statement.
 */
@Component
public class BenecoBillParser implements BillParser {

    private static final Pattern ACCOUNT_NUMBER =
        Pattern.compile("(?i)account\\s*(?:no\\.?|number)\\s*[:\\-]?\\s*([A-Z0-9\\-]{5,})");

    /**
     * Real BENECO receipts print the meter reading history as an unlabeled table, not
     * "Previous Reading:" / "Present Reading:" text - confirmed against an actual bill:
     *   DATE          READING           KWH USED
     *   06-30-2026    14878             75.00
     *   05-26-2026    14803
     * Row 1 (more recent date) = current reading + this period's consumption.
     * Row 2 (older date) = previous reading, no kWh value on that line.
     * One match gives current reading, previous reading, consumption, and the billing date
     * (the more recent of the two) all at once.
     */
    private static final Pattern READING_TABLE = Pattern.compile(
        "(\\d{1,2}-\\d{1,2}-\\d{4})\\s+(\\d+)\\s+(\\d+\\.\\d{2})\\s+(\\d{1,2}-\\d{1,2}-\\d{4})\\s+(\\d+)");

    // Fallback for a formal-statement-style bill that does use explicit labels, in case a
    // different BENECO bill layout shows up later.
    private static final Pattern BILLING_PERIOD =
        Pattern.compile("(?i)billing\\s*period\\s*[:\\-]?\\s*(.+)");
    private static final Pattern BILLING_DATE =
        Pattern.compile("(?i)(?:billing|statement)\\s*date\\s*[:\\-]?\\s*([A-Za-z0-9,/\\- ]+)");
    /**
     * The negative lookbehind matters: real BENECO bills also print "AFTER DUE DATE : 977.04"
     * (a penalty amount, not a date) earlier in the text than the actual due date line (e.g.
     * "DUE DATE FOR CURRENT BILL : 07/10/2026"), and a bare "due date" match finds that decoy
     * first every time - Matcher.find() stops at the first hit, so it silently returned null
     * instead of ever reaching the real date. Excluding anything preceded by "after" skips the
     * decoy while still matching both real-world label styles ("Due Date:" and "Due Date For
     * Current Bill:") without needing to hardcode either one's exact wording.
     */
    private static final Pattern DUE_DATE =
        Pattern.compile("(?i)(?<!after\\s{1,5})due\\s*date[^:\\n]*:\\s*([\\d/\\-.,A-Za-z ]+)");
    private static final Pattern PREVIOUS_READING =
        Pattern.compile("(?i)previous\\s*reading\\s*[:\\-]?\\s*([\\d,]+)");
    private static final Pattern CURRENT_READING =
        Pattern.compile("(?i)(?:present|current)\\s*reading\\s*[:\\-]?\\s*([\\d,]+)");
    private static final Pattern CONSUMPTION =
        Pattern.compile("(?i)(?:total\\s*)?consumption\\s*[:\\-]?\\s*([\\d,]+)\\s*kwh");

    /**
     * Total wasn't visible in the real receipt text this was tuned against (the photo cut off
     * before reaching it) - these are best-effort alternatives covering common phrasings, not
     * confirmed against a real "total" line the way the fields above are. Verify against a
     * full, uncropped bill photo when one's available.
     */
    private static final Pattern TOTAL_AMOUNT = Pattern.compile(
        "(?i)(?:total\\s*(?:amount\\s*due|current\\s*charges|bill(?:\\s*amount)?|charges)|amount\\s*due)"
            + "\\s*[:\\-]?\\s*(?:php|₱)?\\s*([\\d,]+\\.\\d{2})");

    @Override
    public String providerKey() {
        return "BENECO";
    }

    /**
     * A real photographed receipt has "BENECO" embedded in a logo graphic (not transcribable
     * text) while the legible printed text is the full legal name - so match on both.
     */
    @Override
    public List<String> detectionAliases() {
        return List.of("BENECO", "BENGUET ELECTRIC COOPERATIVE");
    }

    @Override
    public ParsedBillData parse(String rawText) {
        Matcher table = READING_TABLE.matcher(rawText);

        Double previousReading;
        Double currentReading;
        Double consumption;
        String billingDateText = null;
        String billingPeriod = null;

        if (table.find()) {
            billingDateText = table.group(1);
            currentReading = parseDecimal(table.group(2));
            consumption = parseDecimal(table.group(3));
            String previousDateText = table.group(4);
            previousReading = parseDecimal(table.group(5));
            billingPeriod = previousDateText + " to " + billingDateText;
        } else {
            // Formal-statement fallback, in case a different bill layout appears later.
            previousReading = findDecimal(PREVIOUS_READING, rawText);
            currentReading = findDecimal(CURRENT_READING, rawText);
            consumption = findDecimal(CONSUMPTION, rawText);
            if (consumption == null && previousReading != null && currentReading != null) {
                consumption = currentReading - previousReading;
            }
            billingDateText = find(BILLING_DATE, rawText);
            billingPeriod = find(BILLING_PERIOD, rawText);
        }

        return new ParsedBillData(
            "BENECO",
            find(ACCOUNT_NUMBER, rawText),
            LooseDateParser.parse(billingDateText),
            billingPeriod,
            LooseDateParser.parse(find(DUE_DATE, rawText)),
            findDecimal(TOTAL_AMOUNT, rawText),
            previousReading,
            currentReading,
            consumption
        );
    }

    private String find(Pattern pattern, String text) {
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group(1).trim() : null;
    }

    private Double findDecimal(Pattern pattern, String text) {
        return parseDecimal(find(pattern, text));
    }

    private Double parseDecimal(String value) {
        if (value == null) {
            return null;
        }
        try {
            return Double.parseDouble(value.replace(",", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}

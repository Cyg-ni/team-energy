package com.teamenergy.billocr.service.ocr;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.springframework.stereotype.Component;

/**
 * Label-anchored regex parsing tuned against typical BENECO bill wording. These patterns are a
 * starting point - validate and adjust them against real BENECO bill samples before relying on
 * them; OCR noise on phone photos will need real fixtures to tune against, not just this file.
 */
@Component
public class BenecoBillParser implements BillParser {

    private static final Pattern ACCOUNT_NUMBER =
        Pattern.compile("(?i)account\\s*(?:no\\.?|number)\\s*[:\\-]?\\s*([A-Z0-9\\-]{5,})");
    private static final Pattern BILLING_PERIOD =
        Pattern.compile("(?i)billing\\s*period\\s*[:\\-]?\\s*(.+)");
    private static final Pattern BILLING_DATE =
        Pattern.compile("(?i)(?:billing|statement)\\s*date\\s*[:\\-]?\\s*([A-Za-z0-9,/ ]+)");
    private static final Pattern DUE_DATE =
        Pattern.compile("(?i)due\\s*date\\s*[:\\-]?\\s*([A-Za-z0-9,/ ]+)");
    private static final Pattern TOTAL_AMOUNT =
        Pattern.compile("(?i)total\\s*amount\\s*due\\s*[:\\-]?\\s*(?:php|₱)?\\s*([\\d,]+\\.\\d{2})");
    private static final Pattern PREVIOUS_READING =
        Pattern.compile("(?i)previous\\s*reading\\s*[:\\-]?\\s*([\\d,]+)");
    private static final Pattern CURRENT_READING =
        Pattern.compile("(?i)(?:present|current)\\s*reading\\s*[:\\-]?\\s*([\\d,]+)");
    private static final Pattern CONSUMPTION =
        Pattern.compile("(?i)(?:total\\s*)?consumption\\s*[:\\-]?\\s*([\\d,]+)\\s*kwh");

    @Override
    public String providerKey() {
        return "BENECO";
    }

    @Override
    public ParsedBillData parse(String rawText) {
        Double previousReading = findDecimal(PREVIOUS_READING, rawText);
        Double currentReading = findDecimal(CURRENT_READING, rawText);
        Double consumption = findDecimal(CONSUMPTION, rawText);
        if (consumption == null && previousReading != null && currentReading != null) {
            consumption = currentReading - previousReading;
        }

        return new ParsedBillData(
            "BENECO",
            find(ACCOUNT_NUMBER, rawText),
            LooseDateParser.parse(find(BILLING_DATE, rawText)),
            find(BILLING_PERIOD, rawText),
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
        String match = find(pattern, text);
        if (match == null) {
            return null;
        }
        try {
            return Double.parseDouble(match.replace(",", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }
}

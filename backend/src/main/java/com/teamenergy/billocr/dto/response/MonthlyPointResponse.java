package com.teamenergy.billocr.dto.response;

/** One point on the consumption-over-time chart. */
public record MonthlyPointResponse(
    String yearMonth,
    Double consumption,
    Double reductionPercent
) {
}

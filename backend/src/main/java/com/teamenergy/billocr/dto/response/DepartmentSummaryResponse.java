package com.teamenergy.billocr.dto.response;

import java.util.List;

public record DepartmentSummaryResponse(
    Long departmentId,
    String departmentName,
    Double baselineConsumptionKwh,
    Double currentMonthConsumption,
    Double reductionPercent,
    boolean goalMet,
    List<MonthlyPointResponse> monthlyTrend
) {
}

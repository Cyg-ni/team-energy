package com.teamenergy.billocr.dto.response;

import com.teamenergy.billocr.entity.BillStatus;
import java.time.LocalDate;
import java.util.List;

public record BillResponse(
    Long id,
    String billNumber,
    String provider,
    String accountNumber,
    Long departmentId,
    String departmentName,
    LocalDate billingDate,
    String billingPeriod,
    LocalDate dueDate,
    Double totalAmount,
    Double previousReading,
    Double currentReading,
    Double consumption,
    BillStatus status,
    boolean ocrExtracted,
    Double ocrConfidence,
    Double reductionPercentVsBaseline,
    List<BillEventResponse> timeline
) {
}

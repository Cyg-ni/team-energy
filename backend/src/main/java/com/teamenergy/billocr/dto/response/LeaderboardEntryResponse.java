package com.teamenergy.billocr.dto.response;

public record LeaderboardEntryResponse(
    int rank,
    Long departmentId,
    String departmentName,
    Double reductionPercent,
    boolean goalMet
) {
}

package com.teamenergy.billocr.dto.response;

import java.time.LocalDateTime;

public record BillEventResponse(
    String status,
    String actor,
    String note,
    LocalDateTime occurredAt
) {
}

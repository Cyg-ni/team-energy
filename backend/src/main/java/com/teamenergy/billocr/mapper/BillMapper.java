package com.teamenergy.billocr.mapper;

import com.teamenergy.billocr.dto.response.BillEventResponse;
import com.teamenergy.billocr.dto.response.BillResponse;
import com.teamenergy.billocr.entity.Bill;
import com.teamenergy.billocr.entity.BillEvent;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class BillMapper {

    public BillResponse toResponse(Bill bill, List<BillEvent> events) {
        return new BillResponse(
            bill.getId(),
            bill.getBillNumber(),
            bill.getProvider(),
            bill.getAccountNumber(),
            bill.getDepartment().getId(),
            bill.getDepartment().getName(),
            bill.getBillingDate(),
            bill.getBillingPeriod(),
            bill.getDueDate(),
            bill.getTotalAmount(),
            bill.getPreviousReading(),
            bill.getCurrentReading(),
            bill.getConsumption(),
            bill.getStatus(),
            bill.isOcrExtracted(),
            bill.getOcrConfidence(),
            bill.getReductionPercentVsBaseline(),
            events.stream().map(this::toEventResponse).toList()
        );
    }

    private BillEventResponse toEventResponse(BillEvent event) {
        return new BillEventResponse(event.getStatus(), event.getActor(), event.getNote(), event.getOccurredAt());
    }
}

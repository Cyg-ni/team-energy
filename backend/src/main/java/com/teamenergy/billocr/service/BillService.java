package com.teamenergy.billocr.service;

import com.teamenergy.billocr.dto.request.BillValidationRequest;
import com.teamenergy.billocr.dto.response.BillResponse;
import com.teamenergy.billocr.entity.Bill;
import com.teamenergy.billocr.entity.BillEvent;
import com.teamenergy.billocr.entity.BillStatus;
import com.teamenergy.billocr.entity.Department;
import com.teamenergy.billocr.exception.ResourceNotFoundException;
import com.teamenergy.billocr.mapper.BillMapper;
import com.teamenergy.billocr.repository.BillEventRepository;
import com.teamenergy.billocr.repository.BillRepository;
import com.teamenergy.billocr.repository.DepartmentRepository;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BillService {

    private static final DateTimeFormatter BILL_NUMBER_MONTH = DateTimeFormatter.ofPattern("yyyy-MM");

    private final BillRepository billRepository;
    private final BillEventRepository billEventRepository;
    private final DepartmentRepository departmentRepository;
    private final BillMapper billMapper;

    public BillService(
        BillRepository billRepository,
        BillEventRepository billEventRepository,
        DepartmentRepository departmentRepository,
        BillMapper billMapper
    ) {
        this.billRepository = billRepository;
        this.billEventRepository = billEventRepository;
        this.departmentRepository = departmentRepository;
        this.billMapper = billMapper;
    }

    @Transactional
    public BillResponse save(BillValidationRequest request) {
        Department department = departmentRepository.findById(request.departmentId())
            .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + request.departmentId()));

        Double reductionPercent = department.getBaselineConsumptionKwh() == null
            ? null
            : computeReductionPercent(department.getBaselineConsumptionKwh(), request.consumption());

        Bill bill = Bill.builder()
            .billNumber(request.provider() + "-" + request.billingDate().format(BILL_NUMBER_MONTH))
            .provider(request.provider())
            .accountNumber(request.accountNumber())
            .department(department)
            .billingDate(request.billingDate())
            .billingPeriod(request.billingPeriod())
            .dueDate(request.dueDate())
            .totalAmount(request.totalAmount())
            .previousReading(request.previousReading())
            .currentReading(request.currentReading())
            .consumption(request.consumption())
            .status(BillStatus.SUBMITTED)
            .ocrExtracted(Boolean.TRUE.equals(request.ocrExtracted()))
            .ocrConfidence(request.ocrConfidence())
            .extractedAt(Boolean.TRUE.equals(request.ocrExtracted()) ? LocalDateTime.now() : null)
            .documentReference(request.documentReference())
            .reductionPercentVsBaseline(reductionPercent)
            .build();

        Bill saved = billRepository.save(bill);
        recordTimeline(saved, request);

        return billMapper.toResponse(saved, billEventRepository.findByBillIdOrderByOccurredAtAsc(saved.getId()));
    }

    public BillResponse getById(Long id) {
        Bill bill = billRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Bill not found: " + id));
        return billMapper.toResponse(bill, billEventRepository.findByBillIdOrderByOccurredAtAsc(id));
    }

    public List<BillResponse> getByDepartment(Long departmentId) {
        return billRepository.findByDepartmentIdOrderByBillingDateDesc(departmentId).stream()
            .map(bill -> billMapper.toResponse(bill, billEventRepository.findByBillIdOrderByOccurredAtAsc(bill.getId())))
            .toList();
    }

    public List<BillResponse> getAll() {
        return billRepository.findAll().stream()
            .map(bill -> billMapper.toResponse(bill, billEventRepository.findByBillIdOrderByOccurredAtAsc(bill.getId())))
            .toList();
    }

    /** Positive = reduction achieved, negative = consumption increased over baseline. */
    static Double computeReductionPercent(double baseline, double actual) {
        if (baseline <= 0) {
            return null;
        }
        return ((baseline - actual) / baseline) * 100.0;
    }

    private void recordTimeline(Bill bill, BillValidationRequest request) {
        LocalDateTime now = LocalDateTime.now();
        if (Boolean.TRUE.equals(request.ocrExtracted())) {
            billEventRepository.save(BillEvent.builder()
                .bill(bill).status("Uploaded").actor("System").note("Bill file uploaded and OCR processing started")
                .occurredAt(now).build());
            billEventRepository.save(BillEvent.builder()
                .bill(bill).status("Extracted").actor("System")
                .note("OCR data extracted" + (request.ocrConfidence() != null
                    ? String.format(" with %.0f%% confidence", request.ocrConfidence() * 100) : ""))
                .occurredAt(now).build());
        }
        billEventRepository.save(BillEvent.builder()
            .bill(bill).status("Validated").actor("Staff").note("Bill information verified and confirmed")
            .occurredAt(now).build());
        billEventRepository.save(BillEvent.builder()
            .bill(bill).status("Saved").actor("System").note("Bill data saved to dashboard")
            .occurredAt(now).build());
    }
}

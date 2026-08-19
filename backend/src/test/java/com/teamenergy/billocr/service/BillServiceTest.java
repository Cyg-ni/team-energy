package com.teamenergy.billocr.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.teamenergy.billocr.dto.request.BillValidationRequest;
import com.teamenergy.billocr.dto.response.BillResponse;
import com.teamenergy.billocr.entity.Bill;
import com.teamenergy.billocr.entity.BillEvent;
import com.teamenergy.billocr.entity.Department;
import com.teamenergy.billocr.exception.ResourceNotFoundException;
import com.teamenergy.billocr.mapper.BillMapper;
import com.teamenergy.billocr.repository.BillEventRepository;
import com.teamenergy.billocr.repository.BillRepository;
import com.teamenergy.billocr.repository.DepartmentRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BillServiceTest {

    @Mock
    private BillRepository billRepository;
    @Mock
    private BillEventRepository billEventRepository;
    @Mock
    private DepartmentRepository departmentRepository;

    private BillService billService;

    @BeforeEach
    void setUp() {
        billService = new BillService(billRepository, billEventRepository, departmentRepository, new BillMapper());
    }

    /** Stubs only needed once save() gets past the department lookup. */
    private void stubSuccessfulPersistence() {
        AtomicLong idSequence = new AtomicLong(1);
        when(billRepository.save(any(Bill.class))).thenAnswer(invocation -> {
            Bill bill = invocation.getArgument(0);
            bill.setId(idSequence.getAndIncrement());
            return bill;
        });
        when(billEventRepository.save(any(BillEvent.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(billEventRepository.findByBillIdOrderByOccurredAtAsc(any())).thenReturn(List.of());
    }

    private BillValidationRequest validRequest(Long departmentId) {
        return new BillValidationRequest(
            departmentId,
            "BENECO",
            "ACC-4521-8847-3",
            LocalDate.of(2026, 8, 1),
            "July 1 - July 31, 2026",
            LocalDate.of(2026, 8, 15),
            3245.50,
            12450.0,
            12875.0,
            425.0,
            "some-doc-ref.jpg",
            true,
            0.97
        );
    }

    @Test
    void computesReductionPercentAgainstDepartmentBaseline() {
        stubSuccessfulPersistence();
        Department department = Department.builder()
            .id(1L).name("College of Engineering").code("COE").baselineConsumptionKwh(500.0).build();

        when(departmentRepository.findById(1L)).thenReturn(Optional.of(department));

        BillResponse response = billService.save(validRequest(1L));

        // (500 - 425) / 500 * 100 = 15%
        assertThat(response.reductionPercentVsBaseline()).isEqualTo(15.0);
        assertThat(response.billNumber()).isEqualTo("BENECO-2026-08");
    }

    @Test
    void leavesReductionPercentNullWhenNoBaselineIsConfigured() {
        stubSuccessfulPersistence();
        Department department = Department.builder().id(2L).name("Office of Student Affairs").code("OSA").build();

        when(departmentRepository.findById(2L)).thenReturn(Optional.of(department));

        BillResponse response = billService.save(validRequest(2L));

        assertThat(response.reductionPercentVsBaseline()).isNull();
    }

    @Test
    void throwsWhenDepartmentDoesNotExist() {
        when(departmentRepository.findById(99L)).thenReturn(Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(
            ResourceNotFoundException.class, () -> billService.save(validRequest(99L)));
    }
}

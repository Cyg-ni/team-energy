package com.teamenergy.billocr.repository;

import com.teamenergy.billocr.entity.Bill;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByDepartmentIdOrderByBillingDateDesc(Long departmentId);

    List<Bill> findByDepartmentIdAndBillingDateBetween(Long departmentId, LocalDate start, LocalDate end);
}

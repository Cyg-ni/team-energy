package com.teamenergy.billocr.repository;

import com.teamenergy.billocr.entity.MonthlyReport;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MonthlyReportRepository extends JpaRepository<MonthlyReport, Long> {

    Optional<MonthlyReport> findByDepartmentIdAndYearMonth(Long departmentId, String yearMonth);

    List<MonthlyReport> findByYearMonthOrderByReductionPercentDesc(String yearMonth);

    List<MonthlyReport> findByDepartmentIdOrderByYearMonthAsc(Long departmentId);
}

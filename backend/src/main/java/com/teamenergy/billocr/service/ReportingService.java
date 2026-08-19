package com.teamenergy.billocr.service;

import com.teamenergy.billocr.dto.response.DepartmentSummaryResponse;
import com.teamenergy.billocr.dto.response.LeaderboardEntryResponse;
import com.teamenergy.billocr.dto.response.MonthlyPointResponse;
import com.teamenergy.billocr.entity.Bill;
import com.teamenergy.billocr.entity.Department;
import com.teamenergy.billocr.entity.MonthlyReport;
import com.teamenergy.billocr.exception.ResourceNotFoundException;
import com.teamenergy.billocr.repository.BillRepository;
import com.teamenergy.billocr.repository.DepartmentRepository;
import com.teamenergy.billocr.repository.MonthlyReportRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Owns the two "automatic charting" concerns the capstone brief asks for:
 * live dashboard/leaderboard aggregation, and a scheduled job that snapshots
 * each month into MonthlyReport rows so past reports stay stable over time.
 */
@Service
public class ReportingService {

    private static final int TREND_MONTHS = 6;
    private static final DateTimeFormatter YEAR_MONTH = DateTimeFormatter.ofPattern("yyyy-MM");

    private final BillRepository billRepository;
    private final DepartmentRepository departmentRepository;
    private final MonthlyReportRepository monthlyReportRepository;

    public ReportingService(
        BillRepository billRepository,
        DepartmentRepository departmentRepository,
        MonthlyReportRepository monthlyReportRepository
    ) {
        this.billRepository = billRepository;
        this.departmentRepository = departmentRepository;
        this.monthlyReportRepository = monthlyReportRepository;
    }

    public DepartmentSummaryResponse getDepartmentSummary(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
            .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + departmentId));

        Double baseline = department.getBaselineConsumptionKwh();
        YearMonth currentMonth = YearMonth.now();
        List<MonthlyPointResponse> trend = new ArrayList<>();
        Double currentMonthConsumption = null;

        for (int i = TREND_MONTHS - 1; i >= 0; i--) {
            YearMonth month = currentMonth.minusMonths(i);
            double total = sumConsumption(departmentId, month);
            Double reductionPercent = baseline == null ? null : BillService.computeReductionPercent(baseline, total);
            trend.add(new MonthlyPointResponse(month.format(YEAR_MONTH), total, reductionPercent));
            if (i == 0) {
                currentMonthConsumption = total;
            }
        }

        Double currentReductionPercent = baseline == null || currentMonthConsumption == null
            ? null : BillService.computeReductionPercent(baseline, currentMonthConsumption);

        return new DepartmentSummaryResponse(
            department.getId(),
            department.getName(),
            baseline,
            currentMonthConsumption,
            currentReductionPercent,
            currentReductionPercent != null && currentReductionPercent >= 20.0,
            trend
        );
    }

    public List<LeaderboardEntryResponse> getLeaderboard() {
        YearMonth currentMonth = YearMonth.now();

        List<LeaderboardEntryResponse> unranked = departmentRepository.findAll().stream()
            .map(department -> {
                Double baseline = department.getBaselineConsumptionKwh();
                double total = sumConsumption(department.getId(), currentMonth);
                Double reductionPercent = baseline == null ? null : BillService.computeReductionPercent(baseline, total);
                return new LeaderboardEntryResponse(
                    0,
                    department.getId(),
                    department.getName(),
                    reductionPercent,
                    reductionPercent != null && reductionPercent >= 20.0
                );
            })
            .filter(entry -> entry.reductionPercent() != null)
            .sorted(Comparator.comparingDouble(LeaderboardEntryResponse::reductionPercent).reversed())
            .toList();

        List<LeaderboardEntryResponse> ranked = new ArrayList<>();
        for (int i = 0; i < unranked.size(); i++) {
            LeaderboardEntryResponse entry = unranked.get(i);
            ranked.add(new LeaderboardEntryResponse(i + 1, entry.departmentId(), entry.departmentName(),
                entry.reductionPercent(), entry.goalMet()));
        }
        return ranked;
    }

    /** Runs at 02:00 on the 1st of every month, snapshotting the month that just closed. */
    @Scheduled(cron = "0 0 2 1 * ?")
    @org.springframework.transaction.annotation.Transactional
    public void generatePreviousMonthSnapshots() {
        generateSnapshotsForMonth(YearMonth.now().minusMonths(1));
    }

    public void generateSnapshotsForMonth(YearMonth month) {
        for (Department department : departmentRepository.findAll()) {
            Double baseline = department.getBaselineConsumptionKwh();
            if (baseline == null) {
                continue;
            }

            double total = sumConsumption(department.getId(), month);
            Double reductionPercent = BillService.computeReductionPercent(baseline, total);
            String yearMonthKey = month.format(YEAR_MONTH);

            MonthlyReport report = monthlyReportRepository
                .findByDepartmentIdAndYearMonth(department.getId(), yearMonthKey)
                .orElse(MonthlyReport.builder()
                    .department(department)
                    .yearMonth(yearMonthKey)
                    .build());

            report.setTotalConsumption(total);
            report.setBaselineConsumption(baseline);
            report.setReductionPercent(reductionPercent);
            report.setGeneratedAt(LocalDateTime.now());
            monthlyReportRepository.save(report);
        }
    }

    private double sumConsumption(Long departmentId, YearMonth month) {
        LocalDate start = month.atDay(1);
        LocalDate end = month.atEndOfMonth();
        return billRepository
            .findByDepartmentIdAndBillingDateBetween(departmentId, start, end)
            .stream()
            .mapToDouble(Bill::getConsumption)
            .sum();
    }
}

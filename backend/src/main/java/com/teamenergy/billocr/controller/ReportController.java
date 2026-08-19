package com.teamenergy.billocr.controller;

import com.teamenergy.billocr.dto.response.DepartmentSummaryResponse;
import com.teamenergy.billocr.dto.response.LeaderboardEntryResponse;
import com.teamenergy.billocr.service.ReportingService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportController {

    private final ReportingService reportingService;

    public ReportController(ReportingService reportingService) {
        this.reportingService = reportingService;
    }

    @GetMapping("/api/reports/departments/{departmentId}/summary")
    public DepartmentSummaryResponse getDepartmentSummary(@PathVariable Long departmentId) {
        return reportingService.getDepartmentSummary(departmentId);
    }

    @GetMapping("/api/reports/leaderboard")
    public List<LeaderboardEntryResponse> getLeaderboard() {
        return reportingService.getLeaderboard();
    }
}

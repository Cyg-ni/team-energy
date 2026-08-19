package com.teamenergy.billocr.controller;

import com.teamenergy.billocr.dto.response.DepartmentResponse;
import com.teamenergy.billocr.repository.DepartmentRepository;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Read-only for this module - department/baseline management belongs to the org-admin module. */
@RestController
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    public DepartmentController(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    @GetMapping("/api/departments")
    public List<DepartmentResponse> list() {
        return departmentRepository.findAll().stream()
            .map(d -> new DepartmentResponse(d.getId(), d.getName(), d.getCode(), d.getBaselineConsumptionKwh()))
            .toList();
    }
}

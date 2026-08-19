package com.teamenergy.billocr.controller;

import com.teamenergy.billocr.dto.request.BillValidationRequest;
import com.teamenergy.billocr.dto.response.BillExtractionResponse;
import com.teamenergy.billocr.dto.response.BillResponse;
import com.teamenergy.billocr.service.BillIngestionService;
import com.teamenergy.billocr.service.BillService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class BillController {

    private final BillIngestionService billIngestionService;
    private final BillService billService;

    public BillController(BillIngestionService billIngestionService, BillService billService) {
        this.billIngestionService = billIngestionService;
        this.billService = billService;
    }

    /** Step 1 of the upload flow: OCR the file and return best-effort extracted fields. */
    @PostMapping("/api/bills/extract")
    public BillExtractionResponse extract(@RequestParam("file") MultipartFile file) {
        return billIngestionService.extract(file);
    }

    /** Step 2: persist the human-validated fields. */
    @PostMapping("/api/bills")
    @ResponseStatus(HttpStatus.CREATED)
    public BillResponse save(@Valid @RequestBody BillValidationRequest request) {
        return billService.save(request);
    }

    @GetMapping("/api/bills/{id}")
    public BillResponse getById(@PathVariable Long id) {
        return billService.getById(id);
    }

    @GetMapping("/api/bills")
    public List<BillResponse> list(@RequestParam(required = false) Long departmentId) {
        return departmentId == null ? billService.getAll() : billService.getByDepartment(departmentId);
    }
}

package com.teamenergy.billocr.service;

import com.teamenergy.billocr.dto.response.BillExtractionResponse;
import com.teamenergy.billocr.exception.OcrProcessingException;
import com.teamenergy.billocr.service.ocr.BillParser;
import com.teamenergy.billocr.service.ocr.OcrResult;
import com.teamenergy.billocr.service.ocr.OcrTextExtractor;
import com.teamenergy.billocr.service.ocr.ParsedBillData;
import com.teamenergy.billocr.service.ocr.ProviderDetector;
import com.teamenergy.billocr.storage.FileStorageService;
import java.io.File;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/** Orchestrates step 1 of the upload flow: store the file, OCR it, parse it, hand it back for validation. */
@Service
public class BillIngestionService {

    private final FileStorageService fileStorageService;
    private final OcrTextExtractor ocrTextExtractor;
    private final ProviderDetector providerDetector;

    public BillIngestionService(
        FileStorageService fileStorageService,
        OcrTextExtractor ocrTextExtractor,
        ProviderDetector providerDetector
    ) {
        this.fileStorageService = fileStorageService;
        this.ocrTextExtractor = ocrTextExtractor;
        this.providerDetector = providerDetector;
    }

    public BillExtractionResponse extract(MultipartFile file) {
        String documentReference = fileStorageService.store(file);
        File storedFile = fileStorageService.resolve(documentReference).toFile();

        OcrResult ocrResult = ocrTextExtractor.extractText(storedFile);
        if (ocrResult.rawText() == null || ocrResult.rawText().isBlank()) {
            throw new OcrProcessingException("No readable text found in the uploaded file.");
        }

        BillParser parser = providerDetector.detect(ocrResult.rawText());
        ParsedBillData parsed = parser.parse(ocrResult.rawText());

        return new BillExtractionResponse(
            parsed.provider(),
            parsed.accountNumber(),
            parsed.billingDate() == null ? null : parsed.billingDate().toString(),
            parsed.billingPeriod(),
            parsed.dueDate() == null ? null : parsed.dueDate().toString(),
            parsed.totalAmount(),
            parsed.previousReading(),
            parsed.currentReading(),
            parsed.consumption(),
            ocrResult.confidence(),
            documentReference
        );
    }
}

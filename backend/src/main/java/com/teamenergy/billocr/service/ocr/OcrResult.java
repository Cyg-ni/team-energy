package com.teamenergy.billocr.service.ocr;

/** rawText is what parsers scan; confidence is the OCR engine's page-level confidence, 0-1. */
public record OcrResult(String rawText, double confidence) {
}

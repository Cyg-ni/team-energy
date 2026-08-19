package com.teamenergy.billocr.service.ocr;

/** rawText is what parsers scan; confidence is the mean Tesseract word confidence, 0-1. */
public record OcrResult(String rawText, double confidence) {
}

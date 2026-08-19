package com.teamenergy.billocr.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * app.ocr.tessdata-path must point at a folder containing eng.traineddata
 * (download from https://github.com/tesseract-ocr/tessdata).
 */
@ConfigurationProperties(prefix = "app.ocr")
public record OcrProperties(String tessdataPath, String language) {
}

package com.teamenergy.billocr.service.ocr;

import java.io.File;

public interface OcrTextExtractor {

    /** Runs OCR over an image or PDF file and returns the raw recognized text (all pages concatenated). */
    OcrResult extractText(File file);
}

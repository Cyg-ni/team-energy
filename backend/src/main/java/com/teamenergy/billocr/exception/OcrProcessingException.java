package com.teamenergy.billocr.exception;

/** Thrown when a file can't be read, or the OCR text can't be parsed into bill fields. */
public class OcrProcessingException extends RuntimeException {
    public OcrProcessingException(String message) {
        super(message);
    }

    public OcrProcessingException(String message, Throwable cause) {
        super(message, cause);
    }
}

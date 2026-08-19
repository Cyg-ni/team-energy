package com.teamenergy.billocr.service.ocr;

import com.teamenergy.billocr.exception.OcrProcessingException;
import java.awt.image.BufferedImage;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.springframework.stereotype.Component;

@Component
public class PdfToImageConverter {

    private static final float DPI = 300f;

    /** Bills are usually single-page, but this handles multi-page scans too. */
    public List<BufferedImage> toImages(File pdfFile) {
        List<BufferedImage> pages = new ArrayList<>();
        try (PDDocument document = Loader.loadPDF(pdfFile)) {
            PDFRenderer renderer = new PDFRenderer(document);
            for (int page = 0; page < document.getNumberOfPages(); page++) {
                pages.add(renderer.renderImageWithDPI(page, DPI));
            }
            return pages;
        } catch (Exception e) {
            throw new OcrProcessingException("Failed to render PDF pages for OCR: " + pdfFile.getName(), e);
        }
    }
}

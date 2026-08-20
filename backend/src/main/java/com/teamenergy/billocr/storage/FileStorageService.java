package com.teamenergy.billocr.storage;

import com.teamenergy.billocr.exception.OcrProcessingException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * Writes uploads to local disk first (OcrTextExtractor's contract takes a File), then pushes
 * the same bytes to Supabase Storage as the durable, team-shared copy. documentReference is
 * the same key in both places, so nothing downstream needs to know storage is now two-tier.
 */
@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    private final Path uploadRoot;
    private final SupabaseStorageClient supabaseStorageClient;

    public FileStorageService(
        @Value("${app.storage.upload-dir:uploads}") String uploadDir,
        SupabaseStorageClient supabaseStorageClient
    ) {
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
        this.supabaseStorageClient = supabaseStorageClient;
        try {
            Files.createDirectories(uploadRoot);
        } catch (IOException e) {
            throw new OcrProcessingException("Could not create upload directory: " + uploadRoot, e);
        }
    }

    /** Persists the file under a random name and returns that name (the documentReference). */
    public String store(MultipartFile file) {
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "bill" : file.getOriginalFilename());
        String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')) : "";
        String storedName = UUID.randomUUID() + extension;

        byte[] content;
        try {
            content = file.getBytes();
            Path target = uploadRoot.resolve(storedName).normalize();
            if (!target.getParent().equals(uploadRoot)) {
                throw new OcrProcessingException("Invalid file path");
            }
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new OcrProcessingException("Failed to store uploaded file: " + original, e);
        }

        if (supabaseStorageClient.isConfigured()) {
            supabaseStorageClient.upload(storedName, content, file.getContentType());
        } else {
            log.debug("Supabase Storage not configured - {} kept on local disk only", storedName);
        }

        return storedName;
    }

    public Path resolve(String documentReference) {
        return uploadRoot.resolve(documentReference).normalize();
    }
}

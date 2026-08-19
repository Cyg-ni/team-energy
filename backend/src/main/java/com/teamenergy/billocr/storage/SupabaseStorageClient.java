package com.teamenergy.billocr.storage;

import com.teamenergy.billocr.config.SupabaseStorageProperties;
import com.teamenergy.billocr.exception.StorageException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/**
 * Talks to Supabase Storage's REST API directly (there's no official Java/Spring SDK).
 * NOT tested against a live Supabase project yet - written to Supabase's documented Storage
 * API shape as of this writing. Verify against a real bucket once SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set; the endpoint/header shape is the most likely thing to
 * have drifted if this doesn't work first try.
 */
@Component
public class SupabaseStorageClient {

    private final RestClient restClient;
    private final SupabaseStorageProperties properties;

    public SupabaseStorageClient(RestClient.Builder builder, SupabaseStorageProperties properties) {
        this.properties = properties;
        this.restClient = builder.build();
    }

    public boolean isConfigured() {
        return properties.isConfigured();
    }

    /** objectPath is the key within the bucket, e.g. the same random filename FileStorageService uses locally. */
    public void upload(String objectPath, byte[] content, String contentType) {
        if (!properties.isConfigured()) {
            throw new StorageException(
                "Supabase Storage isn't configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set)");
        }

        try {
            restClient.post()
                .uri("{baseUrl}/storage/v1/object/{bucket}/{path}",
                    properties.url(), properties.storageBucket(), objectPath)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.serviceRoleKey())
                .header("apikey", properties.serviceRoleKey())
                .contentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM)
                .body(content)
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientException e) {
            throw new StorageException("Failed to upload " + objectPath + " to Supabase Storage", e);
        }
    }
}

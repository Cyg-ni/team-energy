package com.teamenergy.billocr.storage;

import com.teamenergy.billocr.config.SupabaseStorageProperties;
import com.teamenergy.billocr.exception.StorageException;
import java.net.URI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Talks to Supabase Storage's REST API directly (there's no official Java/Spring SDK).
 * NOT tested against a live Supabase project yet - written to Supabase's documented Storage
 * API shape as of this writing. Verify against a real bucket once SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY are set; the endpoint/header shape is the most likely thing to
 * have drifted if this doesn't work first try.
 */
@Component
public class SupabaseStorageClient {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageClient.class);

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

        // properties.url() must be resolved as the base (scheme + host) before any template
        // expansion happens - passing it as a "{baseUrl}" template variable (the previous
        // approach) makes Spring's URI parser treat the whole template as relative, since that
        // decision is made from the raw template text before substitution, and the raw text
        // starts with "{", not "https:". fromUriString() parses the actual resolved value
        // instead, so it's correctly recognized as absolute.
        URI uri = UriComponentsBuilder.fromUriString(properties.url())
            .path("/storage/v1/object/{bucket}/{path}")
            .buildAndExpand(properties.storageBucket(), objectPath)
            .toUri();

        try {
            restClient.post()
                .uri(uri)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + properties.serviceRoleKey())
                .header("apikey", properties.serviceRoleKey())
                .contentType(contentType != null ? MediaType.parseMediaType(contentType) : MediaType.APPLICATION_OCTET_STREAM)
                .body(content)
                .retrieve()
                .toBodilessEntity();
        } catch (RestClientResponseException e) {
            // Supabase's response body normally says exactly why (bad key, missing bucket,
            // RLS-denied) - surfacing it directly beats leaving whoever's debugging this to
            // guess from a generic "Storage Unavailable" with no cause visible anywhere.
            log.error("Supabase Storage rejected upload of {}: {} - {}",
                objectPath, e.getStatusCode(), e.getResponseBodyAsString());
            throw new StorageException(
                "Failed to upload " + objectPath + " to Supabase Storage ("
                    + e.getStatusCode() + "): " + e.getResponseBodyAsString(), e);
        } catch (RestClientException e) {
            log.error("Failed to reach Supabase Storage for {}: {}", objectPath, e.getMessage());
            throw new StorageException(
                "Failed to upload " + objectPath + " to Supabase Storage: " + e.getMessage(), e);
        }
    }
}

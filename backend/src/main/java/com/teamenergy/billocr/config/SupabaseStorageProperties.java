package com.teamenergy.billocr.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * url is the Supabase project's API URL (e.g. https://<project-ref>.supabase.co), shown on the
 * project dashboard - not the Postgres connection string. serviceRoleKey must never reach the
 * frontend; this backend is the only trusted holder of it.
 */
@ConfigurationProperties(prefix = "app.supabase")
public record SupabaseStorageProperties(String url, String serviceRoleKey, String storageBucket) {

    public boolean isConfigured() {
        return url != null && !url.isBlank() && serviceRoleKey != null && !serviceRoleKey.isBlank();
    }
}

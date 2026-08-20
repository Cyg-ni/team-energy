package com.teamenergy.billocr.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * model is configurable rather than hardcoded so it's a one-line properties change if
 * "gemini-1.5-flash" gets superseded - check aistudio.google.com for current model names.
 */
@ConfigurationProperties(prefix = "app.gemini")
public record GeminiProperties(String apiKey, String model) {

    public boolean isConfigured() {
        return apiKey != null && !apiKey.isBlank();
    }
}

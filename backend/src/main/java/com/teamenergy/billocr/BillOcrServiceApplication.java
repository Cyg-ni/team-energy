package com.teamenergy.billocr;

import com.teamenergy.billocr.config.OcrProperties;
import com.teamenergy.billocr.config.SupabaseStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableConfigurationProperties({OcrProperties.class, SupabaseStorageProperties.class})
@EnableScheduling
public class BillOcrServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BillOcrServiceApplication.class, args);
    }
}

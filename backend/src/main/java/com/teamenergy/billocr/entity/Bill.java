package com.teamenergy.billocr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "bills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bill_number")
    private String billNumber;

    /** Free text on purpose: BENECO, NUVELCO, or any other electric provider a partner institution submits. */
    @Column(nullable = false)
    private String provider;

    @Column(name = "account_number")
    private String accountNumber;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "billing_date")
    private LocalDate billingDate;

    /** Human-readable period label (e.g. "July 1 - July 31, 2026"); billingDate drives aggregation. */
    @Column(name = "billing_period")
    private String billingPeriod;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "previous_reading")
    private Double previousReading;

    @Column(name = "current_reading")
    private Double currentReading;

    @Column(nullable = false)
    private Double consumption;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BillStatus status;

    @Column(name = "ocr_extracted")
    private boolean ocrExtracted;

    @Column(name = "ocr_confidence")
    private Double ocrConfidence;

    @Column(name = "extracted_at")
    private LocalDateTime extractedAt;

    /** Stored filename from FileStorageService, used to reconnect the validate step to its source file. */
    @Column(name = "document_reference")
    private String documentReference;

    @Column(name = "reduction_percent_vs_baseline")
    private Double reductionPercentVsBaseline;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

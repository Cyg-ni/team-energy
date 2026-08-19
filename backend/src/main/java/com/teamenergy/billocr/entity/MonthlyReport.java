package com.teamenergy.billocr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** One row per department/month, written by the scheduled reporting job. */
@Entity
@Table(
    name = "monthly_reports",
    uniqueConstraints = @UniqueConstraint(columnNames = {"department_id", "year_month"}))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    /** "yyyy-MM" */
    @Column(name = "year_month", nullable = false)
    private String yearMonth;

    @Column(name = "total_consumption")
    private Double totalConsumption;

    @Column(name = "baseline_consumption")
    private Double baselineConsumption;

    @Column(name = "reduction_percent")
    private Double reductionPercent;

    @Column(name = "generated_at")
    private LocalDateTime generatedAt;
}

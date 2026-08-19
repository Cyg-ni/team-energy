package com.teamenergy.billocr.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Audit trail row backing the timeline shown on the bill-history / bill-detail screens. */
@Entity
@Table(name = "bill_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BillEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "bill_id", nullable = false)
    private Bill bill;

    private String status;

    private String actor;

    private String note;

    @Column(name = "occurred_at")
    private LocalDateTime occurredAt;
}

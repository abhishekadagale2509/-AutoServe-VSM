package com.project.autoserve.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.project.autoserve.enums.JobStatus;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "job_cards")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobCard extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false, unique = true)
    private Appointment appointment;

    @Column(length = 500)
    private String inspectionNotes;

    @Column(length = 500)
    private String mechanicRemarks;

    @DecimalMin(value = "0.0")
    @Column(nullable = false)
    private BigDecimal estimatedCost;

    @Column(length = 1000)
    private String workDone;

    @DecimalMin(value = "0.0")
    @Column(nullable = false)
    private BigDecimal laborCost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status;

    @OneToMany(
            mappedBy = "jobCard",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @Builder.Default
    private List<JobCardPart> jobCardParts = new ArrayList<>();

}
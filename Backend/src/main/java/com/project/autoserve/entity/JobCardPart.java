package com.project.autoserve.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "jobcard_parts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobCardPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobCardPartId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private JobCard jobCard;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "part_id", nullable = false)
    private SparePart sparePart;

    @Min(value = 1)
    @Column(nullable = false)
    private Integer quantity;

    @DecimalMin(value = "0.0")
    @Column(nullable = false)
    private BigDecimal unitPrice;

    @DecimalMin(value = "0.0")
    @Column(nullable = false)
    private BigDecimal subtotal;
}
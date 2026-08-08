package com.project.autoserve.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.project.autoserve.enums.InvoiceStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "invoices")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invoice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long invoiceId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false, unique = true)
    private JobCard jobCard;

    @DecimalMin(value = "0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal partsTotal;

    @DecimalMin(value = "0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal laborCost;

    @DecimalMin(value = "0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subTotal;

    @DecimalMin(value = "0.0")
    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal gstPercentage;

    @DecimalMin(value = "0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal gstAmount;

    @DecimalMin(value = "0.0")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private LocalDate invoiceDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvoiceStatus status;
}
package com.project.autoserve.dto.invoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import com.project.autoserve.dto.jobcardpart.JobCardPartResponseDTO;
import com.project.autoserve.enums.InvoiceStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponseDTO {

    private Long invoiceId;

    private Long jobId;

    private String customerName;

    private String mechanicName;

    private String vehicleBrand;

    private String vehicleModel;

    private String vehicleNumber;

    private BigDecimal partsTotal;

    private BigDecimal laborCost;

    private BigDecimal subTotal;

    private BigDecimal gstPercentage;

    private BigDecimal gstAmount;

    private BigDecimal totalAmount;

    private LocalDate invoiceDate;

    private InvoiceStatus status;

    private List<JobCardPartResponseDTO> jobCardParts;
}
package com.project.autoserve.dto.jobcard;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

import com.project.autoserve.enums.JobStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import com.project.autoserve.dto.jobcardpart.JobCardPartResponseDTO;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobCardResponseDTO {

    private Long jobId;

    private Long appointmentId;
    
    private String customerName;

    private String vehicleNumber;

    private String mechanicName;

    private String problemDescription;

    private LocalDate appointmentDate;

    private String inspectionNotes;

    private String mechanicRemarks;

    private BigDecimal estimatedCost;

    private String workDone;

    private BigDecimal laborCost;

    private JobStatus status;

    private List<JobCardPartResponseDTO> jobCardParts;
    
    private String vehicleBrand;

    private String vehicleModel;

    private LocalDateTime createdAt;

    private BigDecimal partsTotal;

    private BigDecimal grandTotal;
}
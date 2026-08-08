package com.project.autoserve.dto.jobcard;

import java.math.BigDecimal;

import com.project.autoserve.enums.JobStatus;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
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
public class CreateJobCardRequestDTO {

    @NotNull(message = "Appointment ID is required")
    private Long appointmentId;

    @Size(max = 500, message = "Inspection notes cannot exceed 500 characters")
    private String inspectionNotes;

    @Size(max = 500, message = "Mechanic remarks cannot exceed 500 characters")
    private String mechanicRemarks;

    @NotNull(message = "Estimated cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Estimated cost cannot be negative")
    private BigDecimal estimatedCost;

    @Size(max = 1000, message = "Work done cannot exceed 1000 characters")
    private String workDone;

    @NotNull(message = "Labor cost is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Labor cost cannot be negative")
    private BigDecimal laborCost;

    @NotNull(message = "Job status is required")
    private JobStatus status;
}
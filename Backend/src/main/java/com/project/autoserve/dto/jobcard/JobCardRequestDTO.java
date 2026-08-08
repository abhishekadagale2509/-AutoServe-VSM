package com.project.autoserve.dto.jobcard;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class JobCardRequestDTO {

    private String inspectionNotes;

    private BigDecimal estimatedCost;

    private String workDone;

    private BigDecimal laborCost;
}
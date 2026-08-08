package com.project.autoserve.dto.mechanic;

import com.project.autoserve.enums.AvailabilityStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MechanicResponseDTO {

    private Long mechanicId;

    private String name;

    private String specialization;

    private Integer experience;

    private AvailabilityStatus availabilityStatus;
    
    private String phone;
}
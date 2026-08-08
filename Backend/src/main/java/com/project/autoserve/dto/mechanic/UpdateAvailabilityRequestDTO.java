package com.project.autoserve.dto.mechanic;

import com.project.autoserve.enums.AvailabilityStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateAvailabilityRequestDTO {

    @NotNull(message = "Availability status is required.")
    private AvailabilityStatus availabilityStatus;

}
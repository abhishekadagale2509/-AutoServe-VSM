package com.project.autoserve.dto.mechanic;

import com.project.autoserve.enums.AvailabilityStatus;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateMechanicRequestDTO {

    @NotBlank(message = "Name is required.")
    private String name;

    @NotBlank(message = "Phone is required.")
    private String phone;

    @NotBlank(message = "Specialization is required.")
    private String specialization;

    @NotNull(message = "Experience is required.")
    @Min(value = 0, message = "Experience cannot be negative.")
    private Integer experience;

    @NotNull(message = "Availability status is required.")
    private AvailabilityStatus availabilityStatus;
}
package com.project.autoserve.dto.mechanic;

import com.project.autoserve.enums.AvailabilityStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateMechanicRequestDTO {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String phone;

    @NotBlank
    private String specialization;

    @NotNull
    private Integer experience;

    @NotNull
    private AvailabilityStatus availabilityStatus;
}
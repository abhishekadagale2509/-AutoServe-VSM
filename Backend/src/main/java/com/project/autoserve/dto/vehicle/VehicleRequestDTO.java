package com.project.autoserve.dto.vehicle;

import com.project.autoserve.enums.VehicleType;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class VehicleRequestDTO {

    private VehicleType vehicleType;

    @NotBlank
    private String vehicleNumber;

    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    private Integer year;

    @NotBlank
    private String fuelType;
}
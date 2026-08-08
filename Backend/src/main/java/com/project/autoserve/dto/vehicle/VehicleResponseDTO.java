package com.project.autoserve.dto.vehicle;

import com.project.autoserve.enums.VehicleType;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VehicleResponseDTO {

    private Long vehicleId;

    private VehicleType vehicleType;

    private String vehicleNumber;

    private String brand;

    private String model;

    private Integer year;

    private String fuelType;
}
package com.project.autoserve.dto.appointment;

import java.time.LocalDate;

import com.project.autoserve.enums.AppointmentStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AppointmentResponseDTO {

    private Long appointmentId;

    private Long jobId;

    private String vehicleNumber;

    private String mechanicName;

    private LocalDate appointmentDate;

    private AppointmentStatus status;

    private String problemDescription;
    
    private String customerName;

    private String vehicleMake;

    private String vehicleModel;
}
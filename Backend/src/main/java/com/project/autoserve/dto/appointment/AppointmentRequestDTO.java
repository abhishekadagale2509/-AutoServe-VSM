package com.project.autoserve.dto.appointment;

import java.time.LocalDate;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AppointmentRequestDTO {

    private Long vehicleId;

    @FutureOrPresent(message = "Appointment date cannot be in the past")
    private LocalDate appointmentDate;

    @NotBlank
    private String problemDescription;
}
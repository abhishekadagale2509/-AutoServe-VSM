package com.project.autoserve.dto.appointment;

import com.project.autoserve.enums.AppointmentStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAppointmentStatusRequestDTO {

    @NotNull(message = "Appointment status is required.")
    private AppointmentStatus status;

}
package com.project.autoserve.dto.dashboard;

import java.util.List;

import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.enums.AvailabilityStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MechanicDashboardResponseDTO {

    private Long assignedJobs;

    private Long completedJobs;

    private Long todayAppointments;

    private List<AppointmentResponseDTO> todayAppointmentDetails;
    
    private AvailabilityStatus availabilityStatus;

}
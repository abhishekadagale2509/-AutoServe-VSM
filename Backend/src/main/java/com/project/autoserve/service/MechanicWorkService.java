package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.appointment.AppointmentResponseDTO;

public interface MechanicWorkService {

    List<AppointmentResponseDTO> getMyAssignedAppointments(String email);

    AppointmentResponseDTO acceptAppointment(Long appointmentId, String email);

    AppointmentResponseDTO startWork(Long appointmentId, String email);

    AppointmentResponseDTO completeWork(Long appointmentId, String email);
    
    List<AppointmentResponseDTO> getEligibleAppointmentsForJobCard(
            String email);

}
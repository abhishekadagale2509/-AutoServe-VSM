package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.appointment.AppointmentRequestDTO;
import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.enums.AppointmentStatus;

public interface AppointmentService {

    /**
     * Book a new appointment.
     *
     * @param request Appointment details.
     * @param userEmail Logged-in user's email.
     * @return Booked appointment.
     */
    AppointmentResponseDTO bookAppointment(
            AppointmentRequestDTO request,
            String userEmail);

    /**
     * Get all appointments of the logged-in user.
     *
     * @param userEmail Logged-in user's email.
     * @return List of appointments.
     */
    List<AppointmentResponseDTO> getMyAppointments(
            String userEmail,
            String search);

    /**
     * Get appointment by ID.
     *
     * @param appointmentId Appointment ID.
     * @return Appointment details.
     */
    AppointmentResponseDTO getAppointmentById(
            Long appointmentId);
    
    List<AppointmentResponseDTO> getAllAppointments();
    
    AppointmentResponseDTO assignMechanic(
            Long appointmentId,
            Long mechanicId
    );

    AppointmentResponseDTO updateAppointmentStatus(
            Long appointmentId,
            AppointmentStatus status
    );
    
    AppointmentResponseDTO cancelAppointment(
            Long appointmentId,
            String userEmail
    );

}
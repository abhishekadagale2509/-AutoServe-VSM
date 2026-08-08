package com.project.autoserve.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.service.MechanicWorkService;
import com.project.autoserve.util.ApiResponse;

@RestController
@RequestMapping("/api/mechanic/work")
public class MechanicWorkController {

    private final MechanicWorkService mechanicWorkService;

    public MechanicWorkController(
            MechanicWorkService mechanicWorkService) {

        this.mechanicWorkService = mechanicWorkService;
    }

    @GetMapping("/appointments")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getMyAppointments(
            Principal principal) {

        List<AppointmentResponseDTO> appointments =
                mechanicWorkService.getMyAssignedAppointments(
                        principal.getName());

        return ResponseEntity.ok(
                ApiResponse.<List<AppointmentResponseDTO>>builder()
                        .success(true)
                        .message("Assigned appointments fetched successfully.")
                        .data(appointments)
                        .build());
    }
    
    @PutMapping("/appointments/{appointmentId}/accept")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>>
    acceptAppointment(
            @PathVariable Long appointmentId,
            Principal principal) {

        AppointmentResponseDTO appointment =
                mechanicWorkService.acceptAppointment(
                        appointmentId,
                        principal.getName());

        return ResponseEntity.ok(
                ApiResponse.<AppointmentResponseDTO>builder()
                        .success(true)
                        .message("Appointment accepted successfully.")
                        .data(appointment)
                        .build());

    }
    
    @PutMapping("/appointments/{appointmentId}/start")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>>
    startWork(
            @PathVariable Long appointmentId,
            Principal principal) {

        AppointmentResponseDTO appointment =
                mechanicWorkService.startWork(
                        appointmentId,
                        principal.getName());

        return ResponseEntity.ok(
                ApiResponse.<AppointmentResponseDTO>builder()
                        .success(true)
                        .message("Work started successfully.")
                        .data(appointment)
                        .build());

    }
    
    @PutMapping("/appointments/{appointmentId}/complete")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>>
    completeWork(
            @PathVariable Long appointmentId,
            Principal principal) {

        AppointmentResponseDTO appointment =
                mechanicWorkService.completeWork(
                        appointmentId,
                        principal.getName());

        return ResponseEntity.ok(
                ApiResponse.<AppointmentResponseDTO>builder()
                        .success(true)
                        .message("Work completed successfully.")
                        .data(appointment)
                        .build());

    }
    
    @GetMapping("/appointments/eligible-jobcards")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>>
    getEligibleAppointmentsForJobCard(
            Principal principal) {

        List<AppointmentResponseDTO> appointments =
                mechanicWorkService.getEligibleAppointmentsForJobCard(
                        principal.getName());

        return ResponseEntity.ok(
                ApiResponse.<List<AppointmentResponseDTO>>builder()
                        .success(true)
                        .message("Eligible appointments fetched successfully.")
                        .data(appointments)
                        .build());
    }
}
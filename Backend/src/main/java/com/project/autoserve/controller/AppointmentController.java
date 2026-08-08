package com.project.autoserve.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.appointment.AppointmentRequestDTO;
import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.service.AppointmentService;
import com.project.autoserve.util.ApiResponse;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;

import com.project.autoserve.dto.appointment.AssignMechanicRequestDTO;
import com.project.autoserve.dto.appointment.UpdateAppointmentStatusRequestDTO;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> bookAppointment(
            @Valid @RequestBody AppointmentRequestDTO request,
            Principal principal) {

        AppointmentResponseDTO appointment =
                appointmentService.bookAppointment(
                        request,
                        principal.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<AppointmentResponseDTO>builder()
                        .success(true)
                        .message("Appointment booked successfully.")
                        .data(appointment)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getMyAppointments(
            Principal principal,
            @RequestParam(required = false) String search) {

        List<AppointmentResponseDTO> appointments =
                appointmentService.getMyAppointments(
                        principal.getName(),
                        search);

        return ResponseEntity.ok(
                ApiResponse.<List<AppointmentResponseDTO>>builder()
                        .success(true)
                        .message("Appointments fetched successfully.")
                        .data(appointments)
                        .build());
    }

    @GetMapping("/{appointmentId}")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> getAppointmentById(
            @PathVariable Long appointmentId) {

        AppointmentResponseDTO appointment =
                appointmentService.getAppointmentById(appointmentId);

        return ResponseEntity.ok(
                ApiResponse.<AppointmentResponseDTO>builder()
                        .success(true)
                        .message("Appointment fetched successfully.")
                        .data(appointment)
                        .build());
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<AppointmentResponseDTO>>> getAllAppointments() {

        List<AppointmentResponseDTO> appointments =
                appointmentService.getAllAppointments();

        return ResponseEntity.ok(
                ApiResponse.<List<AppointmentResponseDTO>>builder()
                        .success(true)
                        .message("All appointments fetched successfully.")
                        .data(appointments)
                        .build());
    }
    
    @PutMapping("/{appointmentId}/assign")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> assignMechanic(
            @PathVariable Long appointmentId,
            @Valid @RequestBody AssignMechanicRequestDTO request) {

        AppointmentResponseDTO appointment =
                appointmentService.assignMechanic(
                        appointmentId,
                        request.getMechanicId());

        return ResponseEntity.ok(
                ApiResponse.<AppointmentResponseDTO>builder()
                        .success(true)
                        .message("Mechanic assigned successfully.")
                        .data(appointment)
                        .build());
    }
    
    @PutMapping("/{appointmentId}/status")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> updateAppointmentStatus(
            @PathVariable Long appointmentId,
            @Valid @RequestBody UpdateAppointmentStatusRequestDTO request) {

        AppointmentResponseDTO appointment =
                appointmentService.updateAppointmentStatus(
                        appointmentId,
                        request.getStatus());

        return ResponseEntity.ok(
                ApiResponse.<AppointmentResponseDTO>builder()
                        .success(true)
                        .message("Appointment status updated successfully.")
                        .data(appointment)
                        .build());
    }
    
    @PutMapping("/{appointmentId}/cancel")
    public ResponseEntity<ApiResponse<AppointmentResponseDTO>> cancelAppointment(
            @PathVariable Long appointmentId,
            Principal principal) {

        AppointmentResponseDTO appointment =
                appointmentService.cancelAppointment(
                        appointmentId,
                        principal.getName());

        return ResponseEntity.ok(
                ApiResponse.<AppointmentResponseDTO>builder()
                        .success(true)
                        .message("Appointment cancelled successfully.")
                        .data(appointment)
                        .build());
    }

}
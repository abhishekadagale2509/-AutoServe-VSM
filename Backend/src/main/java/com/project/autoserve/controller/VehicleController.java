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
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.vehicle.VehicleRequestDTO;
import com.project.autoserve.dto.vehicle.VehicleResponseDTO;
import com.project.autoserve.service.VehicleService;
import com.project.autoserve.util.ApiResponse;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VehicleResponseDTO>> addVehicle(
            @Valid @RequestBody VehicleRequestDTO request,
            Principal principal) {

        VehicleResponseDTO vehicle = vehicleService.addVehicle(
                request,
                principal.getName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<VehicleResponseDTO>builder()
                        .success(true)
                        .message("Vehicle added successfully.")
                        .data(vehicle)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<VehicleResponseDTO>>> getMyVehicles(
            Principal principal,
            @RequestParam(required = false) String search) {

        List<VehicleResponseDTO> vehicles =
                vehicleService.getMyVehicles(
                        principal.getName(),
                        search);

        return ResponseEntity.ok(
                ApiResponse.<List<VehicleResponseDTO>>builder()
                        .success(true)
                        .message("Vehicles fetched successfully.")
                        .data(vehicles)
                        .build());
    }

    @GetMapping("/{vehicleId}")
    public ResponseEntity<ApiResponse<VehicleResponseDTO>> getVehicleById(
            @PathVariable Long vehicleId) {

        VehicleResponseDTO vehicle =
                vehicleService.getVehicleById(vehicleId);

        return ResponseEntity.ok(
                ApiResponse.<VehicleResponseDTO>builder()
                        .success(true)
                        .message("Vehicle fetched successfully.")
                        .data(vehicle)
                        .build());
    }
    
    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<VehicleResponseDTO>>> getAllVehicles(
            @RequestParam(required = false) String search) {

        List<VehicleResponseDTO> vehicles =
                vehicleService.getAllVehicles(search);

        return ResponseEntity.ok(
                ApiResponse.<List<VehicleResponseDTO>>builder()
                        .success(true)
                        .message("Vehicles fetched successfully.")
                        .data(vehicles)
                        .build());
    }

}
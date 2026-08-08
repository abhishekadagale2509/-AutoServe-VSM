package com.project.autoserve.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.mechanic.CreateMechanicRequestDTO;
import com.project.autoserve.dto.mechanic.MechanicResponseDTO;
import com.project.autoserve.dto.mechanic.UpdateMechanicRequestDTO;
import com.project.autoserve.service.MechanicService;
import com.project.autoserve.util.ApiResponse;

import jakarta.validation.Valid;
import com.project.autoserve.dto.mechanic.UpdateAvailabilityRequestDTO;

@RestController
@RequestMapping("/api/mechanics")
public class MechanicController {

    private final MechanicService mechanicService;

    public MechanicController(MechanicService mechanicService) {
        this.mechanicService = mechanicService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MechanicResponseDTO>> addMechanic(
            @Valid @RequestBody CreateMechanicRequestDTO request) {

        MechanicResponseDTO response = mechanicService.addMechanic(request);

        ApiResponse<MechanicResponseDTO> apiResponse =
                ApiResponse.<MechanicResponseDTO>builder()
                        .success(true)
                        .message("Mechanic added successfully.")
                        .data(response)
                        .build();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MechanicResponseDTO>>> getAllMechanics() {

        List<MechanicResponseDTO> mechanics =
                mechanicService.getAllMechanics();

        ApiResponse<List<MechanicResponseDTO>> apiResponse =
                ApiResponse.<List<MechanicResponseDTO>>builder()
                        .success(true)
                        .message("Mechanics fetched successfully.")
                        .data(mechanics)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }
    
    @GetMapping("/{mechanicId}")
    public ResponseEntity<ApiResponse<MechanicResponseDTO>> getMechanicById(
            @PathVariable Long mechanicId) {

        MechanicResponseDTO mechanic =
                mechanicService.getMechanicById(mechanicId);

        ApiResponse<MechanicResponseDTO> apiResponse =
                ApiResponse.<MechanicResponseDTO>builder()
                        .success(true)
                        .message("Mechanic fetched successfully.")
                        .data(mechanic)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }
    
    @PutMapping("/{mechanicId}")
    public ResponseEntity<ApiResponse<MechanicResponseDTO>> updateMechanic(
            @PathVariable Long mechanicId,
            @Valid @RequestBody UpdateMechanicRequestDTO request) {

        MechanicResponseDTO updatedMechanic =
                mechanicService.updateMechanic(mechanicId, request);

        ApiResponse<MechanicResponseDTO> apiResponse =
                ApiResponse.<MechanicResponseDTO>builder()
                        .success(true)
                        .message("Mechanic updated successfully.")
                        .data(updatedMechanic)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }
    
    @DeleteMapping("/{mechanicId}")
    public ResponseEntity<ApiResponse<Void>> deactivateMechanic(
            @PathVariable Long mechanicId) {

        mechanicService.deactivateMechanic(mechanicId);

        ApiResponse<Void> apiResponse =
                ApiResponse.<Void>builder()
                        .success(true)
                        .message("Mechanic deactivated successfully.")
                        .build();

        return ResponseEntity.ok(apiResponse);
    }
    
    @PutMapping("/me/availability")
    public ResponseEntity<ApiResponse<MechanicResponseDTO>> updateAvailability(
            @Valid @RequestBody UpdateAvailabilityRequestDTO request) {

        MechanicResponseDTO mechanic =
                mechanicService.updateAvailability(request);

        ApiResponse<MechanicResponseDTO> apiResponse =
                ApiResponse.<MechanicResponseDTO>builder()
                        .success(true)
                        .message("Availability updated successfully.")
                        .data(mechanic)
                        .build();

        return ResponseEntity.ok(apiResponse);
    }

}
package com.project.autoserve.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.profile.MechanicProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;
import com.project.autoserve.service.MechanicProfileService;
import com.project.autoserve.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/mechanic/profile")
@RequiredArgsConstructor
public class MechanicProfileController {

    private final MechanicProfileService mechanicProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<MechanicProfileResponseDTO>> getProfile() {

        return ResponseEntity.ok(
                ApiResponse.<MechanicProfileResponseDTO>builder()
                        .success(true)
                        .message("Profile fetched successfully.")
                        .data(mechanicProfileService.getProfile())
                        .build());
    }

    @PutMapping
    public ResponseEntity<ApiResponse<MechanicProfileResponseDTO>> updateProfile(
            @Valid @RequestBody UpdateProfileRequestDTO request) {

        return ResponseEntity.ok(
                ApiResponse.<MechanicProfileResponseDTO>builder()
                        .success(true)
                        .message("Profile updated successfully.")
                        .data(mechanicProfileService.updateProfile(request))
                        .build());
    }
}
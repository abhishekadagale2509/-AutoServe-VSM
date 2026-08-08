package com.project.autoserve.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.profile.CustomerProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;
import com.project.autoserve.service.ProfileService;
import com.project.autoserve.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/customer/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<CustomerProfileResponseDTO>> getProfile() {

        return ResponseEntity.ok(
                ApiResponse.<CustomerProfileResponseDTO>builder()
                        .success(true)
                        .message("Profile fetched successfully.")
                        .data(profileService.getProfile())
                        .build());
    }

    @PutMapping
    public ResponseEntity<ApiResponse<CustomerProfileResponseDTO>> updateProfile(
            @Valid @RequestBody UpdateProfileRequestDTO request) {

        return ResponseEntity.ok(
                ApiResponse.<CustomerProfileResponseDTO>builder()
                        .success(true)
                        .message("Profile updated successfully.")
                        .data(profileService.updateProfile(request))
                        .build());
    }
}
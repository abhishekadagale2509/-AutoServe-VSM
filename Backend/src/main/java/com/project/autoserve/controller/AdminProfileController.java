package com.project.autoserve.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.profile.AdminProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;
import com.project.autoserve.service.AdminProfileService;
import com.project.autoserve.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/profile")
@RequiredArgsConstructor
public class AdminProfileController {

    private final AdminProfileService adminProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminProfileResponseDTO>> getProfile() {

        return ResponseEntity.ok(
                ApiResponse.<AdminProfileResponseDTO>builder()
                        .success(true)
                        .message("Profile fetched successfully.")
                        .data(adminProfileService.getProfile())
                        .build());
    }

    @PutMapping
    public ResponseEntity<ApiResponse<AdminProfileResponseDTO>> updateProfile(
            @Valid @RequestBody UpdateProfileRequestDTO request) {

        return ResponseEntity.ok(
                ApiResponse.<AdminProfileResponseDTO>builder()
                        .success(true)
                        .message("Profile updated successfully.")
                        .data(adminProfileService.updateProfile(request))
                        .build());
    }
}
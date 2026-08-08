package com.project.autoserve.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.servicehistory.ServiceHistoryResponseDTO;
import com.project.autoserve.service.ServiceHistoryService;
import com.project.autoserve.util.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/service-history")
@RequiredArgsConstructor
public class ServiceHistoryController {

    private final ServiceHistoryService serviceHistoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ServiceHistoryResponseDTO>>> getMyHistory() {

        return ResponseEntity.ok(
                ApiResponse.<List<ServiceHistoryResponseDTO>>builder()
                        .success(true)
                        .message("Service history fetched successfully.")
                        .data(serviceHistoryService.getMyServiceHistory())
                        .build());
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ServiceHistoryResponseDTO>>> getAllHistory() {

        return ResponseEntity.ok(
                ApiResponse.<List<ServiceHistoryResponseDTO>>builder()
                        .success(true)
                        .message("All service history fetched successfully.")
                        .data(serviceHistoryService.getAllServiceHistory())
                        .build());
    }
}
package com.project.autoserve.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.project.autoserve.util.ApiResponse;
import com.project.autoserve.dto.razorpay.RazorpayOrderRequestDTO;
import com.project.autoserve.dto.razorpay.RazorpayOrderResponseDTO;
import com.project.autoserve.service.RazorpayService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/razorpay")
@RequiredArgsConstructor
public class RazorpayController {

    private final RazorpayService razorpayService;

    @PostMapping("/create-order")
    public ResponseEntity<ApiResponse<RazorpayOrderResponseDTO>> createOrder(
            @Valid @RequestBody RazorpayOrderRequestDTO request)
            throws Exception {

        RazorpayOrderResponseDTO response =
                razorpayService.createOrder(request);

        return ResponseEntity.ok(
                ApiResponse.<RazorpayOrderResponseDTO>builder()
                        .success(true)
                        .message("Order created successfully.")
                        .data(response)
                        .build()
        );
    }
}
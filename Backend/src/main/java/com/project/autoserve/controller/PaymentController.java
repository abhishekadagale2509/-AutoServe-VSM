package com.project.autoserve.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.payment.PaymentRequestDTO;
import com.project.autoserve.dto.payment.PaymentResponseDTO;
import com.project.autoserve.service.PaymentService;
import com.project.autoserve.util.ApiResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> makePayment(
            @Valid @RequestBody PaymentRequestDTO request) {

        PaymentResponseDTO response = paymentService.makePayment(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<PaymentResponseDTO>builder()
                        .success(true)
                        .message("Payment completed successfully.")
                        .data(response)
                        .build());
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> getPaymentById(
            @PathVariable Long paymentId) {

        PaymentResponseDTO response = paymentService.getPaymentById(paymentId);

        return ResponseEntity.ok(
                ApiResponse.<PaymentResponseDTO>builder()
                        .success(true)
                        .message("Payment fetched successfully.")
                        .data(response)
                        .build());
    }

    @GetMapping("/invoice/{invoiceId}")
    public ResponseEntity<ApiResponse<PaymentResponseDTO>> getPaymentByInvoice(
            @PathVariable Long invoiceId) {

        PaymentResponseDTO response = paymentService.getPaymentByInvoice(invoiceId);

        return ResponseEntity.ok(
                ApiResponse.<PaymentResponseDTO>builder()
                        .success(true)
                        .message("Payment fetched successfully.")
                        .data(response)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PaymentResponseDTO>>> getAllPayments() {

        List<PaymentResponseDTO> response = paymentService.getAllPayments();

        return ResponseEntity.ok(
                ApiResponse.<List<PaymentResponseDTO>>builder()
                        .success(true)
                        .message("Payments fetched successfully.")
                        .data(response)
                        .build());
    }
}
package com.project.autoserve.controller;

import java.util.List;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.invoice.InvoiceResponseDTO;
import com.project.autoserve.service.InvoiceService;
import com.project.autoserve.service.pdf.InvoicePdfService;
import com.project.autoserve.util.ApiResponse;

import lombok.RequiredArgsConstructor;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;
    
    private final InvoicePdfService invoicePdfService;

    @PostMapping("/generate/{jobId}")
    public ResponseEntity<ApiResponse<InvoiceResponseDTO>> generateInvoice(
            @PathVariable Long jobId) {

        InvoiceResponseDTO response = invoiceService.generateInvoice(jobId);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<InvoiceResponseDTO>builder()
                        .success(true)
                        .message("Invoice generated successfully.")
                        .data(response)
                        .build());
    }

    @GetMapping("/{invoiceId}")
    public ResponseEntity<ApiResponse<InvoiceResponseDTO>> getInvoiceById(
            @PathVariable Long invoiceId) {

        InvoiceResponseDTO response = invoiceService.getInvoiceById(invoiceId);

        return ResponseEntity.ok(
                ApiResponse.<InvoiceResponseDTO>builder()
                        .success(true)
                        .message("Invoice fetched successfully.")
                        .data(response)
                        .build());
    }

    @GetMapping("/jobcard/{jobId}")
    public ResponseEntity<ApiResponse<InvoiceResponseDTO>> getInvoiceByJobCard(
            @PathVariable Long jobId) {

        InvoiceResponseDTO response = invoiceService.getInvoiceByJobCard(jobId);

        return ResponseEntity.ok(
                ApiResponse.<InvoiceResponseDTO>builder()
                        .success(true)
                        .message("Invoice fetched successfully.")
                        .data(response)
                        .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<InvoiceResponseDTO>>> getAllInvoices() {

        List<InvoiceResponseDTO> response = invoiceService.getAllInvoices();

        return ResponseEntity.ok(
                ApiResponse.<List<InvoiceResponseDTO>>builder()
                        .success(true)
                        .message("Invoices fetched successfully.")
                        .data(response)
                        .build());
    }
    
    @GetMapping("/{invoiceId}/pdf")
    public ResponseEntity<ByteArrayResource> downloadInvoicePdf(
            @PathVariable Long invoiceId) {

        InvoiceResponseDTO invoice =
                invoiceService.getInvoiceById(invoiceId);

        if (!"PAID".equalsIgnoreCase(
                String.valueOf(invoice.getStatus()))) {

            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Invoice PDF can only be downloaded after payment.");
        }

        ByteArrayResource pdf =
                invoicePdfService.generateInvoicePdf(invoiceId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=Invoice_" + invoiceId + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(pdf.contentLength())
                .body(pdf);
    }
}
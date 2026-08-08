package com.project.autoserve.service.impl;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.project.autoserve.dto.razorpay.RazorpayOrderRequestDTO;
import com.project.autoserve.dto.razorpay.RazorpayOrderResponseDTO;
import com.project.autoserve.entity.Invoice;
import com.project.autoserve.enums.InvoiceStatus;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.InvoiceRepository;
import com.project.autoserve.service.RazorpayService;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;

import lombok.RequiredArgsConstructor;
@Service
@RequiredArgsConstructor
public class RazorpayServiceImpl implements RazorpayService {

    private final RazorpayClient razorpayClient;

    private final InvoiceRepository invoiceRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Override
    public RazorpayOrderResponseDTO createOrder(
            RazorpayOrderRequestDTO request)
            throws Exception {

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invoice not found with ID : "
                                        + request.getInvoiceId()));

        if (invoice.getStatus() == InvoiceStatus.PAID) {
            throw new RuntimeException("Invoice already paid.");
        }

        JSONObject options = new JSONObject();

        options.put(
                "amount",
                invoice.getTotalAmount()
                        .multiply(java.math.BigDecimal.valueOf(100))
                        .intValue()
        );

        options.put("currency", "INR");

        options.put("receipt", "INV_" + invoice.getInvoiceId());

        Order order = razorpayClient.orders.create(options);

        return RazorpayOrderResponseDTO.builder()
                .orderId(order.get("id"))
                .amount(invoice.getTotalAmount())
                .currency(order.get("currency"))
                .invoiceId(invoice.getInvoiceId())
                .key(keyId)
                .build();
    }
}
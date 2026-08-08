package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.payment.PaymentRequestDTO;
import com.project.autoserve.dto.payment.PaymentResponseDTO;

public interface PaymentService {

    PaymentResponseDTO makePayment(PaymentRequestDTO request);

    PaymentResponseDTO getPaymentById(Long paymentId);

    PaymentResponseDTO getPaymentByInvoice(Long invoiceId);

    List<PaymentResponseDTO> getAllPayments();

}
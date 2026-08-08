package com.project.autoserve.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.autoserve.dto.payment.PaymentRequestDTO;
import com.project.autoserve.dto.payment.PaymentResponseDTO;
import com.project.autoserve.entity.Invoice;
import com.project.autoserve.entity.Payment;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.InvoiceStatus;
import com.project.autoserve.enums.PaymentStatus;
import com.project.autoserve.enums.Role;
import com.project.autoserve.exception.AccessDeniedException;
import com.project.autoserve.exception.BadRequestException;
import com.project.autoserve.exception.ResourceAlreadyExistsException;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.InvoiceRepository;
import com.project.autoserve.repository.PaymentRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.service.PaymentService;
import com.project.autoserve.util.MapperUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;

    @Override
    public PaymentResponseDTO makePayment(PaymentRequestDTO request) {

        Invoice invoice = invoiceRepository.findById(request.getInvoiceId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found with ID : "
                                + request.getInvoiceId()));
        
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
        
        if (user.getRole() != Role.ADMIN &&
        	    !invoice.getJobCard()
        	            .getAppointment()
        	            .getVehicle()
        	            .getUser()
        	            .getUserId()
        	            .equals(user.getUserId())) {

        	    throw new AccessDeniedException(
        	            "You are not authorized to pay this invoice."
        	    );
        	}

        if (paymentRepository.existsByInvoice(invoice)) {
            throw new ResourceAlreadyExistsException(
                    "Payment already exists for this invoice.");
        }
        
        if (invoice.getStatus() != InvoiceStatus.PAYMENT_PENDING) {

            throw new BadRequestException(
                    "Only payment pending invoices can be paid.");

        }

        Payment payment = Payment.builder()
                .invoice(invoice)
                .amount(invoice.getTotalAmount())
                .paymentMethod(request.getPaymentMethod())
                .transactionId(request.getTransactionId())
                .paymentStatus(PaymentStatus.SUCCESS)
                .paymentDate(LocalDateTime.now())
                .build();

        Payment savedPayment = paymentRepository.save(payment);

        invoice.setStatus(InvoiceStatus.PAID);
        invoiceRepository.save(invoice);

        return MapperUtil.toPaymentResponse(savedPayment);
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentById(Long paymentId) {

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Payment not found with ID : " + paymentId));
        
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));
        
        if (user.getRole() != Role.ADMIN &&
        	    !payment.getInvoice()
        	            .getJobCard()
        	            .getAppointment()
        	            .getVehicle()
        	            .getUser()
        	            .getUserId()
        	            .equals(user.getUserId())) {

        	    throw new AccessDeniedException(
        	            "You are not authorized to view this payment."
        	    );
        	}

        return MapperUtil.toPaymentResponse(payment);
    }
    
    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getPaymentByInvoice(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invoice not found with ID : " + invoiceId));

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        if (user.getRole() != Role.ADMIN &&
                !invoice.getJobCard()
                        .getAppointment()
                        .getVehicle()
                        .getUser()
                        .getUserId()
                        .equals(user.getUserId())) {

            throw new AccessDeniedException(
                    "You are not authorized to view this payment.");
        }

        Payment payment = paymentRepository.findByInvoice(invoice)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Payment not found for Invoice ID : " + invoiceId));

        return MapperUtil.toPaymentResponse(payment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PaymentResponseDTO> getAllPayments() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        List<Payment> payments;

        if (user.getRole() == Role.ADMIN) {
            payments = paymentRepository.findAll();
        } else {
            payments = paymentRepository
                    .findByInvoiceJobCardAppointmentVehicleUser(user);
        }

        return payments.stream()
                .map(MapperUtil::toPaymentResponse)
                .toList();
    }

}
package com.project.autoserve.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.autoserve.dto.invoice.InvoiceResponseDTO;
import com.project.autoserve.entity.Invoice;
import com.project.autoserve.entity.JobCard;
import com.project.autoserve.entity.JobCardPart;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.InvoiceStatus;
import com.project.autoserve.enums.Role;
import com.project.autoserve.exception.AccessDeniedException;
import com.project.autoserve.exception.ResourceAlreadyExistsException;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.InvoiceRepository;
import com.project.autoserve.repository.JobCardPartRepository;
import com.project.autoserve.repository.JobCardRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.service.InvoiceService;
import com.project.autoserve.util.MapperUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InvoiceServiceImpl implements InvoiceService {

	private static final BigDecimal GST_PERCENTAGE = BigDecimal.valueOf(18);
    private final InvoiceRepository invoiceRepository;
    private final JobCardRepository jobCardRepository;
    private final JobCardPartRepository jobCardPartRepository;
    private final UserRepository userRepository;

    @Override
    public InvoiceResponseDTO generateInvoice(Long jobId) {

        JobCard jobCard = jobCardRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Job Card not found with ID : " + jobId));

        if (invoiceRepository.existsByJobCard(jobCard)) {
            throw new ResourceAlreadyExistsException("Invoice already generated for this Job Card.");
        }

        List<JobCardPart> parts = jobCardPartRepository.findByJobCard(jobCard);

        BigDecimal partsTotal = parts.stream()
                .map(JobCardPart::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal laborCost = jobCard.getLaborCost();

        if (laborCost == null) {
            laborCost = BigDecimal.ZERO;
        }

        BigDecimal subTotal = partsTotal.add(laborCost);

        BigDecimal gstPercentage = GST_PERCENTAGE;

        BigDecimal gstAmount = subTotal
                .multiply(gstPercentage)
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal totalAmount = subTotal.add(gstAmount);

        Invoice invoice = Invoice.builder()
                .jobCard(jobCard)
                .partsTotal(partsTotal)
                .laborCost(laborCost)
                .subTotal(subTotal)
                .gstPercentage(gstPercentage)
                .gstAmount(gstAmount)
                .totalAmount(totalAmount)
                .invoiceDate(LocalDate.now())
                .status(InvoiceStatus.PAYMENT_PENDING)
                .build();

        invoiceRepository.save(invoice);

        return MapperUtil.toInvoiceResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponseDTO getInvoiceById(Long invoiceId) {

        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Invoice not found with ID : " + invoiceId));
        
        validateInvoiceAccess(invoice);

        return MapperUtil.toInvoiceResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public InvoiceResponseDTO getInvoiceByJobCard(Long jobId) {

        JobCard jobCard = jobCardRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card not found with ID : " + jobId));

        Invoice invoice = invoiceRepository.findByJobCard(jobCard)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Invoice not found for Job Card : " + jobId));

        validateInvoiceAccess(invoice);

        return MapperUtil.toInvoiceResponse(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InvoiceResponseDTO> getAllInvoices() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        List<Invoice> invoices;

        if (user.getRole() == Role.ADMIN) {
            invoices = invoiceRepository.findAll();
        } else {
            invoices = invoiceRepository.findByJobCardAppointmentVehicleUser(user);
        }

        return invoices.stream()
                .map(MapperUtil::toInvoiceResponse)
                .toList();
    }
    
    private void validateInvoiceAccess(Invoice invoice) {

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
                    "You are not authorized to view this invoice.");
        }
    }

}
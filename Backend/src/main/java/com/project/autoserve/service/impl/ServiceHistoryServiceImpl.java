package com.project.autoserve.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.autoserve.dto.servicehistory.ServiceHistoryResponseDTO;
import com.project.autoserve.entity.Appointment;
import com.project.autoserve.entity.Invoice;
import com.project.autoserve.entity.JobCard;
import com.project.autoserve.entity.Payment;
import com.project.autoserve.entity.User;
import com.project.autoserve.entity.Vehicle;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.AppointmentRepository;
import com.project.autoserve.repository.InvoiceRepository;
import com.project.autoserve.repository.JobCardRepository;
import com.project.autoserve.repository.PaymentRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.repository.VehicleRepository;
import com.project.autoserve.service.ServiceHistoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ServiceHistoryServiceImpl implements ServiceHistoryService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final AppointmentRepository appointmentRepository;
    private final JobCardRepository jobCardRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;

    @Override
    public List<ServiceHistoryResponseDTO> getMyServiceHistory() {

        String email = getLoggedInUserEmail();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        List<Vehicle> vehicles = vehicleRepository.findByUser(user);

        if (vehicles.isEmpty()) {
            return List.of();
        }

        List<Appointment> appointments =
                appointmentRepository.findByVehicleIn(vehicles);

        if (appointments.isEmpty()) {
            return List.of();
        }

        List<JobCard> jobCards =
                jobCardRepository.findByAppointmentIn(appointments);

        List<Invoice> invoices =
                invoiceRepository.findByJobCardIn(jobCards);

        List<Payment> payments =
                paymentRepository.findByInvoiceIn(invoices);

        Map<Long, JobCard> jobCardMap = new HashMap<>();
        for (JobCard jobCard : jobCards) {
            jobCardMap.put(jobCard.getAppointment().getAppointmentId(), jobCard);
        }

        Map<Long, Invoice> invoiceMap = new HashMap<>();
        for (Invoice invoice : invoices) {
            invoiceMap.put(invoice.getJobCard().getJobId(), invoice);
        }

        Map<Long, Payment> paymentMap = new HashMap<>();
        for (Payment payment : payments) {
            paymentMap.put(payment.getInvoice().getInvoiceId(), payment);
        }

        List<ServiceHistoryResponseDTO> history = new ArrayList<>();

        for (Appointment appointment : appointments) {

        	JobCard jobCard =
        	        jobCardMap.get(appointment.getAppointmentId());

        	// Skip appointments that never became a service
        	if (jobCard == null) {
        	    continue;
        	}

        	Invoice invoice =
        	        invoiceMap.get(jobCard.getJobId());

        	Payment payment =
        	        invoice != null
        	                ? paymentMap.get(invoice.getInvoiceId())
        	                : null;

        	history.add(
        	        buildServiceHistory(
        	                appointment.getVehicle(),
        	                appointment,
        	                jobCard,
        	                invoice,
        	                payment));
        }
        
        history.sort(
        	    (a, b) -> b.getAppointmentDate()
        	            .compareTo(a.getAppointmentDate()));

        return history;
    }

    @Override
    public List<ServiceHistoryResponseDTO> getAllServiceHistory() {

        List<Appointment> appointments = appointmentRepository.findAll();

        if (appointments.isEmpty()) {
            return List.of();
        }

        List<JobCard> jobCards =
                jobCardRepository.findByAppointmentIn(appointments);

        List<Invoice> invoices =
                invoiceRepository.findByJobCardIn(jobCards);

        List<Payment> payments =
                paymentRepository.findByInvoiceIn(invoices);

        Map<Long, JobCard> jobCardMap = new HashMap<>();
        for (JobCard jobCard : jobCards) {
            jobCardMap.put(jobCard.getAppointment().getAppointmentId(), jobCard);
        }

        Map<Long, Invoice> invoiceMap = new HashMap<>();
        for (Invoice invoice : invoices) {
            invoiceMap.put(invoice.getJobCard().getJobId(), invoice);
        }

        Map<Long, Payment> paymentMap = new HashMap<>();
        for (Payment payment : payments) {
            paymentMap.put(payment.getInvoice().getInvoiceId(), payment);
        }

        List<ServiceHistoryResponseDTO> history = new ArrayList<>();

        for (Appointment appointment : appointments) {

        	JobCard jobCard =
        	        jobCardMap.get(appointment.getAppointmentId());

        	// Skip appointments that never became a service
        	if (jobCard == null) {
        	    continue;
        	}

        	Invoice invoice =
        	        invoiceMap.get(jobCard.getJobId());

        	Payment payment =
        	        invoice != null
        	                ? paymentMap.get(invoice.getInvoiceId())
        	                : null;

        	history.add(
        	        buildServiceHistory(
        	                appointment.getVehicle(),
        	                appointment,
        	                jobCard,
        	                invoice,
        	                payment));
        }
        
        history.sort(
                (a, b) -> b.getAppointmentDate()
                        .compareTo(a.getAppointmentDate()));

        return history;
    }
    
    private ServiceHistoryResponseDTO buildServiceHistory(
            Vehicle vehicle,
            Appointment appointment,
            JobCard jobCard,
            Invoice invoice,
            Payment payment) {

        return ServiceHistoryResponseDTO.builder()
                .vehicleId(vehicle.getVehicleId())
                .vehicleNumber(vehicle.getVehicleNumber())
                .vehicleBrand(vehicle.getBrand())
                .vehicleModel(vehicle.getModel())

                .appointmentId(appointment.getAppointmentId())
                .appointmentDate(appointment.getAppointmentDate())
                .problemDescription(appointment.getProblemDescription())
                .appointmentStatus(appointment.getStatus())

                .mechanicId(
                        appointment.getMechanic() != null
                                ? appointment.getMechanic().getUser().getUserId()
                                : null)

                .mechanicName(
                        appointment.getMechanic() != null
                                ? appointment.getMechanic().getUser().getName()
                                : null)

                .jobCardId(jobCard != null ? jobCard.getJobId() : null)
                .jobStatus(jobCard != null ? jobCard.getStatus() : null)
                .laborCost(jobCard != null ? jobCard.getLaborCost() : null)

                .invoiceId(invoice != null ? invoice.getInvoiceId() : null)
                .partsTotal(invoice != null ? invoice.getPartsTotal() : null)
                .gstAmount(invoice != null ? invoice.getGstAmount() : null)
                .totalAmount(invoice != null ? invoice.getTotalAmount() : null)
                .invoiceStatus(invoice != null ? invoice.getStatus() : null)

                .paymentId(payment != null ? payment.getPaymentId() : null)
                .paymentStatus(payment != null ? payment.getPaymentStatus() : null)

                .build();
    }

    private String getLoggedInUserEmail() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return authentication.getName();
    }
}
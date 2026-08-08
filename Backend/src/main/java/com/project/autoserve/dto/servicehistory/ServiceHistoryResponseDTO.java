package com.project.autoserve.dto.servicehistory;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.project.autoserve.enums.AppointmentStatus;
import com.project.autoserve.enums.InvoiceStatus;
import com.project.autoserve.enums.JobStatus;
import com.project.autoserve.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceHistoryResponseDTO {

    // Vehicle
    private Long vehicleId;
    private String vehicleNumber;
    private String vehicleBrand;
    private String vehicleModel;

    // Appointment
    private Long appointmentId;
    private LocalDate appointmentDate;
    private String problemDescription;
    private AppointmentStatus appointmentStatus;

    // Mechanic
    private Long mechanicId;
    private String mechanicName;

    // Job Card
    private Long jobCardId;
    private JobStatus jobStatus;
    private BigDecimal laborCost;

    // Invoice
    private Long invoiceId;
    private BigDecimal partsTotal;
    private BigDecimal gstAmount;
    private BigDecimal totalAmount;
    private InvoiceStatus invoiceStatus;

    // Payment
    private Long paymentId;
    private PaymentStatus paymentStatus;
}
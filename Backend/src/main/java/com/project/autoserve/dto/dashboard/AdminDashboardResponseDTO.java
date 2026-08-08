package com.project.autoserve.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.dto.payment.PaymentResponseDTO;

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
public class AdminDashboardResponseDTO {

    private Long totalCustomers;

    private Long totalMechanics;

    private Long totalVehicles;

    private Long totalAppointments;

    private Long pendingAppointments;

    private Long completedJobs;

    private Long totalInvoices;

    private Long totalPayments;

    private BigDecimal totalRevenue;

    private List<AppointmentResponseDTO> recentAppointments;

    private List<PaymentResponseDTO> recentPayments;
    
    private Long cancelledAppointments;

    private Long workingJobs;

    private Long todayAppointments;

    private Long todayRevenue;

}
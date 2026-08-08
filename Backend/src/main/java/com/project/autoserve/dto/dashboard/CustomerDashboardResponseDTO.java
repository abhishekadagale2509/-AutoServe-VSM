package com.project.autoserve.dto.dashboard;

import java.math.BigDecimal;
import java.util.List;

import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.dto.servicehistory.ServiceHistoryResponseDTO;

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
public class CustomerDashboardResponseDTO {

    private Long totalVehicles;

    private Long totalAppointments;

    private Long completedServices;

    private BigDecimal totalSpent;

    private AppointmentResponseDTO upcomingAppointment;

    private List<ServiceHistoryResponseDTO> recentServices;

}
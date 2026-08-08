package com.project.autoserve.service;

import com.project.autoserve.dto.dashboard.AdminDashboardResponseDTO;
import com.project.autoserve.dto.dashboard.CustomerDashboardResponseDTO;
import com.project.autoserve.dto.dashboard.MechanicDashboardResponseDTO;

public interface DashboardService {

    AdminDashboardResponseDTO getAdminDashboard();

    CustomerDashboardResponseDTO getCustomerDashboard();

    MechanicDashboardResponseDTO getMechanicDashboard();

}
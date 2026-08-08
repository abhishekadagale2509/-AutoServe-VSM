package com.project.autoserve.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.dashboard.AdminDashboardResponseDTO;
import com.project.autoserve.dto.dashboard.CustomerDashboardResponseDTO;
import com.project.autoserve.dto.dashboard.MechanicDashboardResponseDTO;
import com.project.autoserve.service.DashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    public ResponseEntity<AdminDashboardResponseDTO> getAdminDashboard() {

        return ResponseEntity.ok(
                dashboardService.getAdminDashboard());
    }
    
    @GetMapping("/customer")
    public ResponseEntity<CustomerDashboardResponseDTO> getCustomerDashboard() {
        return ResponseEntity.ok(dashboardService.getCustomerDashboard());
    }
    
    @GetMapping("/mechanic")
    public ResponseEntity<MechanicDashboardResponseDTO> getMechanicDashboard() {
        return ResponseEntity.ok(dashboardService.getMechanicDashboard());
    }

}
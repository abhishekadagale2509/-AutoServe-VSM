package com.project.autoserve.dto.profile;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.project.autoserve.enums.UserStatus;

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
public class CustomerProfileResponseDTO {

    private Long userId;

    private String name;

    private String email;

    private String phone;

    private LocalDateTime memberSince;

    private Long totalVehicles;

    private Long totalAppointments;

    private BigDecimal totalSpent;
    
    private UserStatus accountStatus;

}
package com.project.autoserve.dto.profile;

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
public class AdminProfileResponseDTO {

    private Long userId;

    private String name;

    private String email;

    private String phone;

    private LocalDateTime memberSince;

    private Long totalCustomers;

    private Long totalMechanics;

    private Long totalAppointments;

    private UserStatus accountStatus;

}
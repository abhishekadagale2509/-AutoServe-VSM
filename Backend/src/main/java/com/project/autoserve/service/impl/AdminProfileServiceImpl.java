package com.project.autoserve.service.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.autoserve.dto.profile.AdminProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.Role;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.AppointmentRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.service.AdminProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminProfileServiceImpl implements AdminProfileService {

    private final UserRepository userRepository;

    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional(readOnly = true)
    public AdminProfileResponseDTO getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Long totalCustomers =
                userRepository.countByRole(Role.CUSTOMER);

        Long totalMechanics =
                userRepository.countByRole(Role.MECHANIC);

        Long totalAppointments =
                appointmentRepository.count();

        return AdminProfileResponseDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .memberSince(user.getCreatedAt())
                .totalCustomers(totalCustomers)
                .totalMechanics(totalMechanics)
                .totalAppointments(totalAppointments)
                .accountStatus(user.getStatus())
                .build();
    }

    @Override
    public AdminProfileResponseDTO updateProfile(
            UpdateProfileRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        user.setName(request.getName());

        user.setPhone(request.getPhone());

        userRepository.save(user);

        return getProfile();
    }

}
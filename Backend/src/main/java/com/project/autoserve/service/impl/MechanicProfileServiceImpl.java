package com.project.autoserve.service.impl;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.autoserve.dto.profile.MechanicProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;
import com.project.autoserve.entity.Mechanic;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.AppointmentStatus;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.AppointmentRepository;
import com.project.autoserve.repository.MechanicRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.service.MechanicProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class MechanicProfileServiceImpl
        implements MechanicProfileService {

    private final UserRepository userRepository;

    private final MechanicRepository mechanicRepository;

    private final AppointmentRepository appointmentRepository;

    @Override
    @Transactional(readOnly = true)
    public MechanicProfileResponseDTO getProfile() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));

        Long totalAssignedJobs =
                appointmentRepository.countByMechanic(mechanic);

        Long completedJobs =
                appointmentRepository.countByMechanicAndStatus(
                        mechanic,
                        AppointmentStatus.COMPLETED
                );

        return MechanicProfileResponseDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .memberSince(user.getCreatedAt())
                .totalAssignedJobs(totalAssignedJobs)
                .completedJobs(completedJobs)
                .accountStatus(user.getStatus())
                .build();
    }

    @Override
    public MechanicProfileResponseDTO updateProfile(
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
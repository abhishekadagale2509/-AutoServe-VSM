package com.project.autoserve.service.impl;

import java.math.BigDecimal;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.project.autoserve.dto.profile.CustomerProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;
import com.project.autoserve.entity.User;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.AppointmentRepository;
import com.project.autoserve.repository.PaymentRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.repository.VehicleRepository;
import com.project.autoserve.service.ProfileService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileServiceImpl implements ProfileService {
	
	private final UserRepository userRepository;
	private final VehicleRepository vehicleRepository;
	private final AppointmentRepository appointmentRepository;
	private final PaymentRepository paymentRepository;
	
	@Override
	@Transactional(readOnly = true)
	public CustomerProfileResponseDTO getProfile() {

	    Authentication authentication =
	            SecurityContextHolder.getContext().getAuthentication();

	    User user = userRepository.findByEmail(authentication.getName())
	            .orElseThrow(() ->
	                    new ResourceNotFoundException("User not found."));

	    Long totalVehicles = vehicleRepository.countByUser(user);

	    Long totalAppointments =
	            appointmentRepository.countByVehicleUser(user);

	    BigDecimal totalSpent =
	            paymentRepository.getTotalSpentByUser(user);

	    return CustomerProfileResponseDTO.builder()
	            .userId(user.getUserId())
	            .name(user.getName())
	            .email(user.getEmail())
	            .phone(user.getPhone())
	            .memberSince(user.getCreatedAt())
	            .totalVehicles(totalVehicles)
	            .totalAppointments(totalAppointments)
	            .totalSpent(totalSpent)
	            .accountStatus(user.getStatus())
	            .build();
	}
	
	@Override
	public CustomerProfileResponseDTO updateProfile(
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
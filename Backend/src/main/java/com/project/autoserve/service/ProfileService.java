package com.project.autoserve.service;

import com.project.autoserve.dto.profile.CustomerProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;

public interface ProfileService {

    CustomerProfileResponseDTO getProfile();

    CustomerProfileResponseDTO updateProfile(
            UpdateProfileRequestDTO request);

}
package com.project.autoserve.service;

import com.project.autoserve.dto.profile.AdminProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;

public interface AdminProfileService {

    AdminProfileResponseDTO getProfile();

    AdminProfileResponseDTO updateProfile(
            UpdateProfileRequestDTO request);

}
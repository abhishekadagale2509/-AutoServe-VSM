package com.project.autoserve.service;

import com.project.autoserve.dto.profile.MechanicProfileResponseDTO;
import com.project.autoserve.dto.profile.UpdateProfileRequestDTO;

public interface MechanicProfileService {

    MechanicProfileResponseDTO getProfile();

    MechanicProfileResponseDTO updateProfile(
            UpdateProfileRequestDTO request);

}
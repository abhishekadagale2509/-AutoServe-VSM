package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.mechanic.CreateMechanicRequestDTO;
import com.project.autoserve.dto.mechanic.MechanicResponseDTO;
import com.project.autoserve.dto.mechanic.UpdateMechanicRequestDTO;
import com.project.autoserve.dto.mechanic.UpdateAvailabilityRequestDTO;
public interface MechanicService {

    MechanicResponseDTO addMechanic(CreateMechanicRequestDTO request);

    List<MechanicResponseDTO> getAllMechanics();

    MechanicResponseDTO getMechanicById(Long mechanicId);

    MechanicResponseDTO updateMechanic(
            Long mechanicId,
            UpdateMechanicRequestDTO request);

    void deactivateMechanic(Long mechanicId);
    
    MechanicResponseDTO updateAvailability(
            UpdateAvailabilityRequestDTO request);

}
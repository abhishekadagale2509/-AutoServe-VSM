package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.vehicle.VehicleRequestDTO;
import com.project.autoserve.dto.vehicle.VehicleResponseDTO;

public interface VehicleService {

    /**
     * Add a new vehicle.
     *
     * @param request Vehicle details.
     * @param userEmail Logged-in user's email.
     * @return Saved vehicle.
     */
    VehicleResponseDTO addVehicle(
            VehicleRequestDTO request,
            String userEmail);

    /**
     * Get all vehicles of the logged-in user.
     *
     * @param userEmail Logged-in user's email.
     * @return List of vehicles.
     */
    List<VehicleResponseDTO> getMyVehicles(
            String userEmail,
            String search);

    List<VehicleResponseDTO> getAllVehicles(
            String search);
    /**
     * Get vehicle by id.
     *
     * @param vehicleId Vehicle ID.
     * @return Vehicle details.
     */
    VehicleResponseDTO getVehicleById(
            Long vehicleId);
}
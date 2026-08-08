package com.project.autoserve.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.project.autoserve.dto.vehicle.VehicleRequestDTO;
import com.project.autoserve.dto.vehicle.VehicleResponseDTO;
import com.project.autoserve.entity.User;
import com.project.autoserve.entity.Vehicle;
import com.project.autoserve.exception.DuplicateResourceException;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.repository.VehicleRepository;
import com.project.autoserve.service.VehicleService;
import com.project.autoserve.util.MapperUtil;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public VehicleServiceImpl(
            VehicleRepository vehicleRepository,
            UserRepository userRepository) {

        this.vehicleRepository = vehicleRepository;
        this.userRepository = userRepository;
    }

    @Override
    public VehicleResponseDTO addVehicle(
            VehicleRequestDTO request,
            String userEmail) {

        if (vehicleRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new DuplicateResourceException("Vehicle already exists.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Vehicle vehicle = new Vehicle();

        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setVehicleNumber(request.getVehicleNumber());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setFuelType(request.getFuelType());

        vehicle.setUser(user);

        Vehicle savedVehicle = vehicleRepository.save(vehicle);

        return MapperUtil.toVehicleResponse(savedVehicle);
    }

    @Override
    public List<VehicleResponseDTO> getMyVehicles(
            String userEmail,
            String search) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        List<Vehicle> vehicles;

        if (search == null || search.isBlank()) {

            vehicles = vehicleRepository.findByUser(user);

        } else {

            vehicles = vehicleRepository.searchMyVehicles(
                    user,
                    search);

        }

        return vehicles.stream()
                .map(MapperUtil::toVehicleResponse)
                .toList();
    }

    @Override
    public VehicleResponseDTO getVehicleById(Long vehicleId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found."));

        return MapperUtil.toVehicleResponse(vehicle);
    }
    
    @Override
    public List<VehicleResponseDTO> getAllVehicles(
            String search) {

        List<Vehicle> vehicles;

        if (search == null || search.isBlank()) {

            vehicles = vehicleRepository.findAll();

        } else {

            vehicles = vehicleRepository.searchAllVehicles(search);

        }

        return vehicles.stream()
                .map(MapperUtil::toVehicleResponse)
                .toList();
    }

}
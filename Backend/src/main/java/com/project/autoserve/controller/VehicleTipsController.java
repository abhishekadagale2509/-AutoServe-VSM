package com.project.autoserve.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.client.VehicleTipsClient;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/vehicle-tips")
@RequiredArgsConstructor
public class VehicleTipsController {

    private final VehicleTipsClient vehicleTipsClient;

    @GetMapping("/{vehicleType}")
    public ResponseEntity<List<String>> getVehicleTips(
            @PathVariable String vehicleType) {

        return ResponseEntity.ok(
                vehicleTipsClient.getTips(vehicleType)
        );
    }
}
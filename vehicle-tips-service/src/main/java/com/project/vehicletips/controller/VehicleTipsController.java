package com.project.vehicletips.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tips")
public class VehicleTipsController {

    @GetMapping("/{vehicleType}")
    public List<String> getVehicleTips(
            @PathVariable String vehicleType) {

        return switch (vehicleType.toUpperCase()) {

            case "CAR" -> List.of(
                    "Check engine oil regularly.",
                    "Maintain correct tyre pressure.",
                    "Inspect brakes periodically.",
                    "Replace air filters when required."
            );

            case "BIKE" -> List.of(
                    "Check engine oil regularly.",
                    "Maintain correct tyre pressure.",
                    "Inspect chain and brakes.",
                    "Check battery and lights periodically."
            );

            case "TRUCK" -> List.of(
                    "Check engine oil and coolant levels.",
                    "Inspect tyres and brakes regularly.",
                    "Check suspension and steering components.",
                    "Follow the recommended service schedule."
            );

            default -> List.of(
                    "Follow the manufacturer's recommended maintenance schedule.",
                    "Check tyre pressure regularly.",
                    "Inspect brakes and fluid levels periodically."
            );
        };
    }
}
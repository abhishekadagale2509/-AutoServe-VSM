package com.project.autoserve.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.sparepart.SparePartResponseDTO;
import com.project.autoserve.service.SparePartService;

@RestController
@RequestMapping("/api/spare-parts")
@CrossOrigin(origins = "*")
public class SparePartController {

    private final SparePartService sparePartService;

    public SparePartController(SparePartService sparePartService) {
        this.sparePartService = sparePartService;
    }

    @GetMapping
    public ResponseEntity<List<SparePartResponseDTO>> getAllParts() {

        return ResponseEntity.ok(
                sparePartService.getAllParts()
        );

    }

}
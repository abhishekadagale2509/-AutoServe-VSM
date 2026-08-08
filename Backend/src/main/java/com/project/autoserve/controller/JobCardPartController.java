package com.project.autoserve.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.jobcardpart.CreateJobCardPartRequestDTO;
import com.project.autoserve.dto.jobcardpart.JobCardPartResponseDTO;
import com.project.autoserve.dto.jobcardpart.UpdateJobCardPartRequestDTO;
import com.project.autoserve.service.JobCardPartService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobcard-parts")
public class JobCardPartController {

    private final JobCardPartService jobCardPartService;

    public JobCardPartController(JobCardPartService jobCardPartService) {
        this.jobCardPartService = jobCardPartService;
    }

    @PostMapping
    public ResponseEntity<JobCardPartResponseDTO> addPart(
            @Valid @RequestBody CreateJobCardPartRequestDTO request) {

        JobCardPartResponseDTO response =
                jobCardPartService.addPart(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobCardPartResponseDTO>> getPartsByJobCard(
            @PathVariable Long jobId) {

        List<JobCardPartResponseDTO> response =
                jobCardPartService.getPartsByJobCard(jobId);

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobCardPartId}")
    public ResponseEntity<JobCardPartResponseDTO> updatePart(
            @PathVariable Long jobCardPartId,
            @Valid @RequestBody UpdateJobCardPartRequestDTO request) {

        JobCardPartResponseDTO response =
                jobCardPartService.updatePart(jobCardPartId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobCardPartId}")
    public ResponseEntity<String> deletePart(
            @PathVariable Long jobCardPartId) {

        jobCardPartService.deletePart(jobCardPartId);

        return ResponseEntity.ok("Spare Part removed successfully.");
    }

}
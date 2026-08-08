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

import com.project.autoserve.dto.jobcard.CreateJobCardRequestDTO;
import com.project.autoserve.dto.jobcard.JobCardResponseDTO;
import com.project.autoserve.dto.jobcard.UpdateJobCardRequestDTO;
import com.project.autoserve.service.JobCardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/jobcards")
public class JobCardController {

    private final JobCardService jobCardService;

    public JobCardController(JobCardService jobCardService) {
        this.jobCardService = jobCardService;
    }

    @PostMapping
    public ResponseEntity<JobCardResponseDTO> createJobCard(
            @Valid @RequestBody CreateJobCardRequestDTO request) {

        JobCardResponseDTO response = jobCardService.createJobCard(request);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobCardResponseDTO> getJobCardById(
            @PathVariable Long jobId) {

        JobCardResponseDTO response = jobCardService.getJobCardById(jobId);

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<JobCardResponseDTO>> getAllJobCards() {

        List<JobCardResponseDTO> response = jobCardService.getAllJobCards();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/{jobId}")
    public ResponseEntity<JobCardResponseDTO> updateJobCard(
            @PathVariable Long jobId,
            @Valid @RequestBody UpdateJobCardRequestDTO request) {

        JobCardResponseDTO response =
                jobCardService.updateJobCard(jobId, request);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<String> deleteJobCard(
            @PathVariable Long jobId) {

        jobCardService.deleteJobCard(jobId);

        return ResponseEntity.ok("Job Card deleted successfully.");
    }
    
    @PutMapping("/{jobId}/finalize")
    public ResponseEntity<JobCardResponseDTO> finalizeJobCard(
            @PathVariable Long jobId) {

        JobCardResponseDTO response =
                jobCardService.finalizeJobCard(jobId);

        return ResponseEntity.ok(response);
    }

}
package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.jobcard.CreateJobCardRequestDTO;
import com.project.autoserve.dto.jobcard.JobCardResponseDTO;
import com.project.autoserve.dto.jobcard.UpdateJobCardRequestDTO;

public interface JobCardService {

    JobCardResponseDTO createJobCard(CreateJobCardRequestDTO request);

    JobCardResponseDTO getJobCardById(Long jobId);

    List<JobCardResponseDTO> getAllJobCards();

    JobCardResponseDTO updateJobCard(Long jobId, UpdateJobCardRequestDTO request);

    void deleteJobCard(Long jobId);
    
    JobCardResponseDTO finalizeJobCard(Long jobId);

}
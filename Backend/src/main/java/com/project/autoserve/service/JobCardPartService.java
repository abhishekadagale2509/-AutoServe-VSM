package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.jobcardpart.CreateJobCardPartRequestDTO;
import com.project.autoserve.dto.jobcardpart.JobCardPartResponseDTO;
import com.project.autoserve.dto.jobcardpart.UpdateJobCardPartRequestDTO;

public interface JobCardPartService {

    JobCardPartResponseDTO addPart(CreateJobCardPartRequestDTO request);

    List<JobCardPartResponseDTO> getPartsByJobCard(Long jobId);

    JobCardPartResponseDTO updatePart(
            Long jobCardPartId,
            UpdateJobCardPartRequestDTO request);

    void deletePart(Long jobCardPartId);

}
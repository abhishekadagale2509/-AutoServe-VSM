package com.project.autoserve.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.project.autoserve.dto.jobcardpart.CreateJobCardPartRequestDTO;
import com.project.autoserve.dto.jobcardpart.JobCardPartResponseDTO;
import com.project.autoserve.dto.jobcardpart.UpdateJobCardPartRequestDTO;
import com.project.autoserve.entity.JobCard;
import com.project.autoserve.entity.JobCardPart;
import com.project.autoserve.entity.SparePart;
import com.project.autoserve.exception.DuplicateResourceException;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.JobCardPartRepository;
import com.project.autoserve.repository.JobCardRepository;
import com.project.autoserve.repository.SparePartRepository;
import com.project.autoserve.service.JobCardPartService;
import com.project.autoserve.util.MapperUtil;

@Service
public class JobCardPartServiceImpl implements JobCardPartService {

    private final JobCardPartRepository jobCardPartRepository;
    private final JobCardRepository jobCardRepository;
    private final SparePartRepository sparePartRepository;

    public JobCardPartServiceImpl(
            JobCardPartRepository jobCardPartRepository,
            JobCardRepository jobCardRepository,
            SparePartRepository sparePartRepository) {

        this.jobCardPartRepository = jobCardPartRepository;
        this.jobCardRepository = jobCardRepository;
        this.sparePartRepository = sparePartRepository;
    }

    @Override
    public JobCardPartResponseDTO addPart(CreateJobCardPartRequestDTO request) {

        JobCard jobCard = jobCardRepository.findById(request.getJobId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card not found with ID: " + request.getJobId()));

        SparePart sparePart = sparePartRepository.findById(request.getPartId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Spare Part not found with ID: " + request.getPartId()));

        Optional<JobCardPart> existingPart =
                jobCardPartRepository.findByJobCardAndSparePart(jobCard, sparePart);

        if (existingPart.isPresent()) {

            JobCardPart part = existingPart.get();

            part.setQuantity(part.getQuantity() + request.getQuantity());

            BigDecimal subtotal = sparePart.getUnitPrice()
                    .multiply(BigDecimal.valueOf(part.getQuantity()));

            part.setSubtotal(subtotal);

            part = jobCardPartRepository.save(part);

            recalculateEstimatedCost(jobCard);

            return MapperUtil.toJobCardPartResponse(part);
        }

        BigDecimal subtotal = sparePart.getUnitPrice()
                .multiply(BigDecimal.valueOf(request.getQuantity()));

        JobCardPart jobCardPart = JobCardPart.builder()
                .jobCard(jobCard)
                .sparePart(sparePart)
                .quantity(request.getQuantity())
                .unitPrice(sparePart.getUnitPrice())
                .subtotal(subtotal)
                .build();

        jobCardPart = jobCardPartRepository.save(jobCardPart);

        recalculateEstimatedCost(jobCard);

        return MapperUtil.toJobCardPartResponse(jobCardPart);
    }

    @Override
    public List<JobCardPartResponseDTO> getPartsByJobCard(Long jobId) {

        JobCard jobCard = jobCardRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card not found with ID: " + jobId));

        return jobCardPartRepository.findByJobCard(jobCard)
                .stream()
                .map(MapperUtil::toJobCardPartResponse)
                .toList();
    }

    @Override
    public JobCardPartResponseDTO updatePart(
            Long jobCardPartId,
            UpdateJobCardPartRequestDTO request) {

        JobCardPart jobCardPart = jobCardPartRepository.findById(jobCardPartId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card Part not found with ID: " + jobCardPartId));

        jobCardPart.setQuantity(request.getQuantity());

        BigDecimal subtotal = jobCardPart.getUnitPrice()
                .multiply(BigDecimal.valueOf(request.getQuantity()));

        jobCardPart.setSubtotal(subtotal);

        jobCardPart = jobCardPartRepository.save(jobCardPart);

        recalculateEstimatedCost(jobCardPart.getJobCard());

        return MapperUtil.toJobCardPartResponse(jobCardPart);
    }

    @Override
    public void deletePart(Long jobCardPartId) {

        JobCardPart jobCardPart = jobCardPartRepository.findById(jobCardPartId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card Part not found with ID: " + jobCardPartId));

        JobCard jobCard = jobCardPart.getJobCard();
        jobCardPartRepository.delete(jobCardPart);

        recalculateEstimatedCost(jobCard);
        jobCardPartRepository.delete(jobCardPart);
    }
    
    private void recalculateEstimatedCost(JobCard jobCard) {

        List<JobCardPart> parts =
                jobCardPartRepository.findByJobCard(jobCard);

        BigDecimal partsTotal = parts.stream()
                .map(JobCardPart::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal labour = jobCard.getLaborCost() == null
                ? BigDecimal.ZERO
                : jobCard.getLaborCost();

        jobCard.setEstimatedCost(partsTotal.add(labour));

        jobCardRepository.save(jobCard);
    }

}
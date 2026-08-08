package com.project.autoserve.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.autoserve.dto.jobcard.CreateJobCardRequestDTO;
import com.project.autoserve.dto.jobcard.JobCardResponseDTO;
import com.project.autoserve.dto.jobcard.UpdateJobCardRequestDTO;
import com.project.autoserve.entity.Appointment;
import com.project.autoserve.entity.JobCard;
import com.project.autoserve.entity.JobCardPart;
import com.project.autoserve.entity.Mechanic;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.AppointmentStatus;
import com.project.autoserve.enums.JobStatus;
import com.project.autoserve.exception.AccessDeniedException;
import com.project.autoserve.exception.BadRequestException;
import com.project.autoserve.exception.DuplicateResourceException;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.AppointmentRepository;
import com.project.autoserve.repository.InvoiceRepository;
import com.project.autoserve.repository.JobCardPartRepository;
import com.project.autoserve.repository.JobCardRepository;
import com.project.autoserve.repository.MechanicRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.service.InvoiceService;
import com.project.autoserve.service.JobCardService;
import com.project.autoserve.util.MapperUtil;

@Service
public class JobCardServiceImpl implements JobCardService {

    private final JobCardRepository jobCardRepository;
    private final AppointmentRepository appointmentRepository;
    private final JobCardPartRepository jobCardPartRepository;
    private final InvoiceService invoiceService;
    private final InvoiceRepository invoiceRepository;
    private final MechanicRepository mechanicRepository;
    private final UserRepository userRepository;

    public JobCardServiceImpl(
            JobCardRepository jobCardRepository,
            AppointmentRepository appointmentRepository,
            JobCardPartRepository jobCardPartRepository,
            InvoiceService invoiceService,
            InvoiceRepository invoiceRepository,
            UserRepository userRepository,
            MechanicRepository mechanicRepository) {

        this.jobCardRepository = jobCardRepository;
        this.appointmentRepository = appointmentRepository;
        this.jobCardPartRepository = jobCardPartRepository;
        this.invoiceService = invoiceService;
        this.invoiceRepository = invoiceRepository;
        this.userRepository = userRepository;
        this.mechanicRepository = mechanicRepository;
    }

    @Override
    public JobCardResponseDTO createJobCard(CreateJobCardRequestDTO request) {

        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Appointment not found with ID: " + request.getAppointmentId()));
        if (appointment.getStatus() != AppointmentStatus.IN_PROGRESS) {

            throw new BadRequestException(
                    "Job Card can only be created for appointments that are IN_PROGRESS."
            );

        }
        
        Mechanic loggedInMechanic = getLoggedInMechanic();

        if (!appointment.getMechanic().getMechanicId()
                .equals(loggedInMechanic.getMechanicId())) {

            throw new AccessDeniedException(
                    "You can only create Job Cards for appointments assigned to you."
            );
        }

        if (jobCardRepository.existsByAppointment(appointment)) {
            throw new DuplicateResourceException(
                    "Job Card already exists for this appointment.");
        }

        JobCard jobCard = JobCard.builder()
                .appointment(appointment)
                .inspectionNotes(request.getInspectionNotes())
                .mechanicRemarks(request.getMechanicRemarks())
                .estimatedCost(BigDecimal.ZERO)
                .workDone(request.getWorkDone())
                .laborCost(request.getLaborCost())
                .status(request.getStatus())
                .build();

        jobCard = jobCardRepository.save(jobCard);
        recalculateEstimatedCost(jobCard);

        return MapperUtil.toJobCardResponse(jobCard);
    }

    @Override
    public JobCardResponseDTO getJobCardById(Long jobId) {

        JobCard jobCard = jobCardRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card not found with ID: " + jobId));

        return MapperUtil.toJobCardResponse(jobCard);
    }

    @Override
    public List<JobCardResponseDTO> getAllJobCards() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        // Admin -> See all Job Cards
        if (user.getRole().name().equals("ADMIN")) {

            return jobCardRepository.findAll()
                    .stream()
                    .map(MapperUtil::toJobCardResponse)
                    .toList();
        }

        // Mechanic -> See only assigned Job Cards
        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));

        return jobCardRepository
                .findByAppointmentMechanic(mechanic)
                .stream()
                .map(MapperUtil::toJobCardResponse)
                .toList();
    }

    @Override
    public JobCardResponseDTO updateJobCard(
            Long jobId,
            UpdateJobCardRequestDTO request) {

        JobCard jobCard = jobCardRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card not found with ID: " + jobId));
        
        Mechanic loggedInMechanic = getLoggedInMechanic();

        if (!jobCard.getAppointment()
                .getMechanic()
                .getMechanicId()
                .equals(loggedInMechanic.getMechanicId())) {

            throw new BadRequestException(
                    "You can only edit your own Job Cards."
            );
        }
        
        if (jobCard.getStatus() == JobStatus.COMPLETED) {

            throw new BadRequestException(
                    "Completed Job Cards cannot be edited."
            );

        }

        jobCard.setInspectionNotes(request.getInspectionNotes());
        jobCard.setMechanicRemarks(request.getMechanicRemarks());
        jobCard.setWorkDone(request.getWorkDone());
        jobCard.setLaborCost(request.getLaborCost());

        jobCard = jobCardRepository.save(jobCard);
        recalculateEstimatedCost(jobCard);

        return MapperUtil.toJobCardResponse(jobCard);
    }

    @Override
    public void deleteJobCard(Long jobId) {

        JobCard jobCard = jobCardRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card not found with ID: " + jobId));

        if (jobCard.getStatus() == JobStatus.COMPLETED) {

            throw new BadRequestException(
                    "Completed Job Cards cannot be deleted."
            );

        }

        if (invoiceRepository.existsByJobCard(jobCard)) {

            throw new BadRequestException(
                    "Job Card cannot be deleted because an invoice has already been generated."
            );

        }

        jobCardRepository.delete(jobCard);
    }
    
    @Override
    public JobCardResponseDTO finalizeJobCard(Long jobId) {

        JobCard jobCard = jobCardRepository.findById(jobId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Job Card not found with ID: " + jobId));

        // Prevent finalizing twice
        if (jobCard.getStatus() == JobStatus.COMPLETED) {
            throw new RuntimeException("Job Card is already finalized.");
        }
        
        if (jobCard.getInspectionNotes() == null ||
        	    jobCard.getInspectionNotes().isBlank()) {

        	    throw new BadRequestException(
        	            "Inspection notes are required before finalizing."
        	    );
        	}

        	if (jobCard.getWorkDone() == null ||
        	    jobCard.getWorkDone().isBlank()) {

        	    throw new BadRequestException(
        	            "Work done is required before finalizing."
        	    );
        	}

        	boolean hasParts =
        	        !jobCardPartRepository.findByJobCard(jobCard).isEmpty();

        	boolean hasLabour =
        	        jobCard.getLaborCost() != null &&
        	        jobCard.getLaborCost().compareTo(BigDecimal.ZERO) > 0;

        	if (!hasParts && !hasLabour) {

        	    throw new BadRequestException(
        	            "Add labour cost or at least one spare part before finalizing."
        	    );
        	}

        // Mark Job Card as completed
        jobCard.setStatus(JobStatus.COMPLETED);

        // Mark Appointment as completed
        Appointment appointment = jobCard.getAppointment();
        appointment.setStatus(AppointmentStatus.COMPLETED);

        appointmentRepository.save(appointment);

        jobCard = jobCardRepository.save(jobCard);

        if (!invoiceRepository.existsByJobCard(jobCard)) {
            invoiceService.generateInvoice(jobId);
        }

        return MapperUtil.toJobCardResponse(jobCard);
    }
    
    private Mechanic getLoggedInMechanic() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        return mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));
    }
    
    private void recalculateEstimatedCost(JobCard jobCard) {

        List<JobCardPart> parts =
                jobCardPartRepository.findByJobCard(jobCard);

        BigDecimal partsTotal = parts.stream()
                .map(JobCardPart::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal labour =
                jobCard.getLaborCost() == null
                        ? BigDecimal.ZERO
                        : jobCard.getLaborCost();

        jobCard.setEstimatedCost(partsTotal.add(labour));

        jobCardRepository.save(jobCard);
    }
}
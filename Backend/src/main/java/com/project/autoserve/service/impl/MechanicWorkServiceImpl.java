package com.project.autoserve.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.entity.Appointment;
import com.project.autoserve.entity.Mechanic;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.AppointmentStatus;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.AppointmentRepository;
import com.project.autoserve.repository.JobCardRepository;
import com.project.autoserve.repository.MechanicRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.service.MechanicWorkService;
import com.project.autoserve.util.MapperUtil;

@Service
public class MechanicWorkServiceImpl implements MechanicWorkService {

    private final UserRepository userRepository;
    private final MechanicRepository mechanicRepository;
    private final AppointmentRepository appointmentRepository;
    private final JobCardRepository jobCardRepository;
    
    @Override
    public List<AppointmentResponseDTO> getMyAssignedAppointments(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));

        return appointmentRepository.findByMechanic(mechanic)
                .stream()
                .map(MapperUtil::toAppointmentResponse)
                .toList();
    }
    
    @Override
    public AppointmentResponseDTO acceptAppointment(
            Long appointmentId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found."));

        if (appointment.getMechanic() == null ||
                !appointment.getMechanic().getMechanicId()
                        .equals(mechanic.getMechanicId())) {

            throw new RuntimeException(
                    "This appointment is not assigned to you.");
        }

        if (appointment.getStatus() != AppointmentStatus.PENDING) {

            throw new RuntimeException(
                    "Only pending appointments can be accepted.");
        }

        appointment.setStatus(AppointmentStatus.ACCEPTED);

        appointmentRepository.save(appointment);

        return MapperUtil.toAppointmentResponse(appointment);

    }
    
    @Override
    public AppointmentResponseDTO startWork(
            Long appointmentId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found."));

        if (appointment.getMechanic() == null ||
            !appointment.getMechanic().getMechanicId()
                    .equals(mechanic.getMechanicId())) {

            throw new RuntimeException(
                    "This appointment is not assigned to you.");
        }

        if (appointment.getStatus() != AppointmentStatus.ACCEPTED) {

            throw new RuntimeException(
                    "Only accepted appointments can be started.");
        }

        appointment.setStatus(AppointmentStatus.IN_PROGRESS);

        appointmentRepository.save(appointment);

        return MapperUtil.toAppointmentResponse(appointment);

    }

    @Override
    public AppointmentResponseDTO completeWork(
            Long appointmentId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Appointment not found."));

        if (appointment.getMechanic() == null ||
            !appointment.getMechanic().getMechanicId()
                    .equals(mechanic.getMechanicId())) {

            throw new RuntimeException(
                    "This appointment is not assigned to you.");
        }

        if (appointment.getStatus() != AppointmentStatus.IN_PROGRESS) {

            throw new RuntimeException(
                    "Only jobs in progress can be completed.");
        }
        
        if (!jobCardRepository.existsByAppointment(appointment)) {
            throw new RuntimeException(
                    "Please create a Job Card before completing the work.");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);

        appointmentRepository.save(appointment);

        return MapperUtil.toAppointmentResponse(appointment);

    }
    
    @Override
    public List<AppointmentResponseDTO> getEligibleAppointmentsForJobCard(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));

        return appointmentRepository.findByMechanic(mechanic)
                .stream()
                .filter(a -> a.getStatus() == AppointmentStatus.IN_PROGRESS)
                .filter(a -> !jobCardRepository.existsByAppointment(a))
                .map(MapperUtil::toAppointmentResponse)
                .toList();
    }

    public MechanicWorkServiceImpl(
            MechanicRepository mechanicRepository,
            AppointmentRepository appointmentRepository,
            UserRepository userRepository,
            JobCardRepository jobCardRepository) {

        this.mechanicRepository = mechanicRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.jobCardRepository = jobCardRepository;
    }
}
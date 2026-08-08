package com.project.autoserve.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.autoserve.entity.Appointment;
import com.project.autoserve.entity.JobCard;
import com.project.autoserve.entity.Mechanic;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.JobStatus;

public interface JobCardRepository extends JpaRepository<JobCard, Long> {

    boolean existsByAppointment(Appointment appointment);

    Optional<JobCard> findByAppointment(Appointment appointment);
    
    List<JobCard> findByAppointmentIn(List<Appointment> appointments);
    
    long countByStatus(JobStatus status);

    long countByAppointmentVehicleUser(User user);

    long countByAppointmentMechanic(Mechanic mechanic);
    
    long count();
    
    long countByAppointmentMechanicAndStatus(
            Mechanic mechanic,
            JobStatus status
    );
    
    List<JobCard> findByAppointmentMechanic(Mechanic mechanic);
}
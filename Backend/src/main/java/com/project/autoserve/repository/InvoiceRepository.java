package com.project.autoserve.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.autoserve.entity.Invoice;
import com.project.autoserve.entity.JobCard;
import com.project.autoserve.entity.User;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    Optional<Invoice> findByJobCard(JobCard jobCard);

    boolean existsByJobCard(JobCard jobCard);
    
    List<Invoice> findByJobCardIn(List<JobCard> jobCards);
    
    long count();

    List<Invoice> findTop5ByOrderByCreatedAtDesc();

    List<Invoice> findByJobCardAppointmentVehicleUser(User user);
}
package com.project.autoserve.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.autoserve.entity.JobCard;
import com.project.autoserve.entity.JobCardPart;
import com.project.autoserve.entity.SparePart;

public interface JobCardPartRepository extends JpaRepository<JobCardPart, Long> {

    List<JobCardPart> findByJobCard(JobCard jobCard);

    Optional<JobCardPart> findByJobCardAndSparePart(JobCard jobCard, SparePart sparePart);

}
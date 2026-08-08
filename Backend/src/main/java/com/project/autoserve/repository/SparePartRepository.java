package com.project.autoserve.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.autoserve.entity.SparePart;

public interface SparePartRepository extends JpaRepository<SparePart, Long> {

}
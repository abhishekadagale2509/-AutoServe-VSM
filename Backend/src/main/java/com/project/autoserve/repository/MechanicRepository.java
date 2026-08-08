package com.project.autoserve.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.autoserve.entity.Mechanic;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.AvailabilityStatus;
import com.project.autoserve.enums.UserStatus;

public interface MechanicRepository extends JpaRepository<Mechanic, Long> {

    Optional<Mechanic> findByUser(User user);

    List<Mechanic> findByAvailabilityStatus(AvailabilityStatus status);
    List<Mechanic> findByUserStatus(UserStatus status);
    long countByUserStatus(UserStatus status);
}
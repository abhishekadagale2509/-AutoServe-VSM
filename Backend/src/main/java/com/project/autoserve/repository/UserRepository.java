package com.project.autoserve.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.autoserve.entity.User;
import com.project.autoserve.enums.Role;
import com.project.autoserve.enums.UserStatus;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    
    long countByRole(Role role);
    
    long count();
    
    long countByRoleAndStatus(Role role, UserStatus status);

}
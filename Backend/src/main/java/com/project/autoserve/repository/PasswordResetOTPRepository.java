package com.project.autoserve.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.autoserve.entity.PasswordResetOTP;
import com.project.autoserve.entity.User;

public interface PasswordResetOTPRepository
        extends JpaRepository<PasswordResetOTP, Long> {

    Optional<PasswordResetOTP> findTopByUserOrderByOtpIdDesc(User user);
}
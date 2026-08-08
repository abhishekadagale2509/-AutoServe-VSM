package com.project.autoserve.service.impl;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.autoserve.dto.auth.ChangePasswordRequestDTO;
import com.project.autoserve.dto.auth.ForgotPasswordRequestDTO;
import com.project.autoserve.dto.auth.LoginRequestDTO;
import com.project.autoserve.dto.auth.LoginResponseDTO;
import com.project.autoserve.dto.auth.RegisterRequestDTO;
import com.project.autoserve.dto.auth.ResetPasswordRequestDTO;
import com.project.autoserve.dto.auth.VerifyOtpRequestDTO;
import com.project.autoserve.entity.PasswordResetOTP;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.Role;
import com.project.autoserve.enums.UserStatus;
import com.project.autoserve.exception.BadRequestException;
import com.project.autoserve.exception.DuplicateResourceException;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.PasswordResetOTPRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.security.CustomUserDetails;
import com.project.autoserve.security.JwtService;
import com.project.autoserve.service.AuthService;
import com.project.autoserve.service.EmailService;
import com.project.autoserve.util.OtpUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    
    private final PasswordResetOTPRepository passwordResetOTPRepository;

    private final EmailService emailService;

    public AuthServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            PasswordResetOTPRepository passwordResetOTPRepository,
            EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.passwordResetOTPRepository = passwordResetOTPRepository;
        this.emailService = emailService;
    }

    @Override
    public String register(RegisterRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered.");
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());

        // Encrypt password
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Default values
        user.setRole(Role.CUSTOMER);
        user.setFirstLogin(false);
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        return "User registered successfully.";
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Invalid email or password."));

        CustomUserDetails userDetails = new CustomUserDetails(user);

        String token = jwtService.generateToken(userDetails);

        return LoginResponseDTO.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .firstLogin(user.isFirstLogin())
                .build();
    }
    
    @Override
    public void forgotPassword(ForgotPasswordRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found."));

     // Delete previous OTP if it exists
        passwordResetOTPRepository
                .findTopByUserOrderByOtpIdDesc(user)
                .ifPresent(passwordResetOTPRepository::delete);

        String otp = OtpUtil.generateOtp();

        PasswordResetOTP resetOTP = PasswordResetOTP.builder()
                .user(user)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .verified(false)
                .build();

        passwordResetOTPRepository.save(resetOTP);

        emailService.sendEmail(
                user.getEmail(),
                "AutoServe Password Reset OTP",
                "Your OTP is: " + otp +
                        "\n\nThis OTP is valid for 10 minutes.");
    }

    @Override
    public void verifyOtp(VerifyOtpRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        PasswordResetOTP otpEntity =
                passwordResetOTPRepository
                        .findTopByUserOrderByOtpIdDesc(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("OTP not found."));

        if (otpEntity.isVerified()) {
            throw new RuntimeException("OTP already used.");
        }

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired.");
        }

        if (!otpEntity.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP.");
        }

        otpEntity.setVerified(true);

        passwordResetOTPRepository.save(otpEntity);
    }

    @Override
    public String resetPassword(ResetPasswordRequestDTO request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        PasswordResetOTP otpEntity =
                passwordResetOTPRepository
                        .findTopByUserOrderByOtpIdDesc(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException("OTP not found."));

        if (!otpEntity.isVerified()) {
            throw new RuntimeException("Please verify OTP first.");
        }
        
        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new IllegalArgumentException(
                    "Password and Confirm Password do not match.");
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        passwordResetOTPRepository.delete(otpEntity);

        return "Password reset successfully.";
    }
    
    @Override
    public void changePassword(ChangePasswordRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        // Verify current password
        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword())) {

            throw new BadRequestException(
                    "Current password is incorrect.");
        }

        // Check new password confirmation
        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new BadRequestException(
                    "Passwords do not match.");
        }
        
     // Prevent using the same password again
        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new BadRequestException(
                    "New password cannot be the same as your current password.");
        }

        // Save new password
        user.setPassword(
                passwordEncoder.encode(request.getNewPassword()));

        user.setFirstLogin(false);

        userRepository.save(user);
    }
}
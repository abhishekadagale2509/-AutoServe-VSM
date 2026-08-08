package com.project.autoserve.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.autoserve.dto.auth.LoginRequestDTO;
import com.project.autoserve.dto.auth.LoginResponseDTO;
import com.project.autoserve.dto.auth.RegisterRequestDTO;
import com.project.autoserve.service.AuthService;
import com.project.autoserve.service.EmailService;
import com.project.autoserve.util.ApiResponse;

import jakarta.validation.Valid;

import com.project.autoserve.dto.auth.ChangePasswordRequestDTO;
import com.project.autoserve.dto.auth.ForgotPasswordRequestDTO;
import com.project.autoserve.dto.auth.VerifyOtpRequestDTO;
import com.project.autoserve.dto.auth.ResetPasswordRequestDTO;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final EmailService emailService;

    public AuthController(
            AuthService authService,
            EmailService emailService) {

        this.authService = authService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody RegisterRequestDTO request) {

        String response = authService.register(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.<String>builder()
                        .success(true)
                        .message("Registration Successful")
                        .data(response)
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponseDTO>> login(
            @Valid @RequestBody LoginRequestDTO request) {

        LoginResponseDTO response = authService.login(request);

        return ResponseEntity.ok(
                ApiResponse.<LoginResponseDTO>builder()
                        .success(true)
                        .message("Login Successful")
                        .data(response)
                        .build());
    }
    
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request) {

        authService.forgotPassword(request);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("OTP sent successfully.")
                        .data("Check your email for the OTP.")
                        .build());
    }
    
    @PostMapping("/verify-otp")
    public ResponseEntity<ApiResponse<String>> verifyOtp(
            @Valid @RequestBody VerifyOtpRequestDTO request) {

        authService.verifyOtp(request);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("OTP verified successfully.")
                        .data("OTP verified.")
                        .build());
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request) {

        String response = authService.resetPassword(request);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message(response)
                        .data(response)
                        .build());
    }
    
    @PostMapping("/test-email")
    public ResponseEntity<String> testEmail() {

        emailService.sendEmail(
                "piratekingemperorluffy@gmail.com",
                "AutoServe Test",
                "Congratulations! Email configuration is working.");

        return ResponseEntity.ok("Email sent successfully.");
    }
    
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequestDTO request) {

        authService.changePassword(request);

        return ResponseEntity.ok(
                ApiResponse.<String>builder()
                        .success(true)
                        .message("Password changed successfully.")
                        .data("Password updated successfully.")
                        .build());
    }

}
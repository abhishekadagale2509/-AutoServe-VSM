package com.project.autoserve.service;

import com.project.autoserve.dto.auth.ChangePasswordRequestDTO;
import com.project.autoserve.dto.auth.ForgotPasswordRequestDTO;
import com.project.autoserve.dto.auth.LoginRequestDTO;
import com.project.autoserve.dto.auth.LoginResponseDTO;
import com.project.autoserve.dto.auth.RegisterRequestDTO;
import com.project.autoserve.dto.auth.ResetPasswordRequestDTO;
import com.project.autoserve.dto.auth.VerifyOtpRequestDTO;

public interface AuthService {

    /**
     * Register a new user
     * @param request RegisterRequestDTO containing user details.
     * @return Success message.
     */
    String register(RegisterRequestDTO request);

    /**
     * Authenticate user and generate JWT token.
     * @param request LoginRequestDTO containing email and password.
     * @return LoginResponseDTO containing JWT token and user details.
     */
    LoginResponseDTO login(LoginRequestDTO request);

    void forgotPassword(ForgotPasswordRequestDTO request);

    void verifyOtp(VerifyOtpRequestDTO request);

    String resetPassword(ResetPasswordRequestDTO request);
    
    void changePassword(ChangePasswordRequestDTO request);
}

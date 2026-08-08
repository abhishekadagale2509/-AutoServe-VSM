package com.project.autoserve.dto.auth;

import com.project.autoserve.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RegisterRequestDTO {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    @Pattern(regexp = "^[6-9]\\d{9}$")
    private String phone;

    private Role role;
}
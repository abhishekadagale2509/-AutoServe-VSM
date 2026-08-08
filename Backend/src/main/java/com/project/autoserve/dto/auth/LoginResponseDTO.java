package com.project.autoserve.dto.auth;

import com.project.autoserve.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class LoginResponseDTO {

    private String token;

    private String name;

    private String email;

    private Role role;
    
    private boolean firstLogin;
}
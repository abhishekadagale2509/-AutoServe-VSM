package com.project.autoserve.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequestDTO {

    @NotBlank(message = "Name is required")
    private String name;

    @Pattern(
        regexp = "^[6-9]\\d{9}$",
        message = "Enter valid mobile number"
    )
    private String phone;

}
package com.project.autoserve.dto.appointment;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AssignMechanicRequestDTO {

    @NotNull(message = "Mechanic ID is required.")
    private Long mechanicId;

}
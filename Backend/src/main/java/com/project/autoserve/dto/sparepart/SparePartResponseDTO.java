package com.project.autoserve.dto.sparepart;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class SparePartResponseDTO {

    private Long partId;

    private String partName;

    private BigDecimal unitPrice;

}
package com.project.autoserve.dto.jobcardpart;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobCardPartResponseDTO {

    private Long jobCardPartId;

    private Long jobId;

    private Long partId;

    private String partName;

    private Integer quantity;

    private BigDecimal unitPrice;

    private BigDecimal subtotal;

}
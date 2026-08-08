package com.project.autoserve.dto.razorpay;

import java.math.BigDecimal;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderResponseDTO {

    private String orderId;

    private BigDecimal amount;

    private String currency;

    private String key;

    private Long invoiceId;

}
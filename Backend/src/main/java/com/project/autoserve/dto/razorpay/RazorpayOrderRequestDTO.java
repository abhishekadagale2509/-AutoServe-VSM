package com.project.autoserve.dto.razorpay;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RazorpayOrderRequestDTO {

    private Long invoiceId;

}
package com.project.autoserve.dto.payment;

import com.project.autoserve.enums.PaymentMethod;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class PaymentRequestDTO {

    @NotNull(message = "Invoice ID is required.")
    private Long invoiceId;

    @NotNull(message = "Payment method is required.")
    private PaymentMethod paymentMethod;

    @NotBlank(message = "Transaction ID is required.")
    private String transactionId;

}
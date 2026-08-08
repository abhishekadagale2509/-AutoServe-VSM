package com.project.autoserve.service;

import com.project.autoserve.dto.razorpay.RazorpayOrderRequestDTO;
import com.project.autoserve.dto.razorpay.RazorpayOrderResponseDTO;

public interface RazorpayService {

    RazorpayOrderResponseDTO createOrder(
            RazorpayOrderRequestDTO request
    ) throws Exception;

}
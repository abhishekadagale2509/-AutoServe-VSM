package com.project.autoserve.service;

import java.util.List;

import com.project.autoserve.dto.invoice.InvoiceResponseDTO;

public interface InvoiceService {

    InvoiceResponseDTO generateInvoice(Long jobId);

    InvoiceResponseDTO getInvoiceById(Long invoiceId);

    InvoiceResponseDTO getInvoiceByJobCard(Long jobId);

    List<InvoiceResponseDTO> getAllInvoices();

}
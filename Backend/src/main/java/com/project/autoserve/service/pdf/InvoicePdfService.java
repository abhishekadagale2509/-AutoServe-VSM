package com.project.autoserve.service.pdf;

import org.springframework.core.io.ByteArrayResource;

public interface InvoicePdfService {

    ByteArrayResource generateInvoicePdf(Long invoiceId);

}
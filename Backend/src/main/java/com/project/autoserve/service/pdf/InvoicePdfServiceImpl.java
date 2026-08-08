package com.project.autoserve.service.pdf;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import com.project.autoserve.service.InvoiceService;

import lombok.RequiredArgsConstructor;

import java.io.ByteArrayOutputStream;
import java.awt.Color;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import com.project.autoserve.dto.invoice.InvoiceResponseDTO;
import com.project.autoserve.dto.jobcardpart.JobCardPartResponseDTO;
import com.project.autoserve.service.InvoiceService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoicePdfServiceImpl implements InvoicePdfService {

    private final InvoiceService invoiceService;
    
    private static final Font TITLE_FONT =
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);

    private static final Font HEADER_FONT =
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);

    private static final Font LABEL_FONT =
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);

    private static final Font NORMAL_FONT =
            FontFactory.getFont(FontFactory.HELVETICA, 11);

    private static final Font TOTAL_FONT =
            FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13);

    @Override
    public ByteArrayResource generateInvoicePdf(Long invoiceId) {

        InvoiceResponseDTO invoice =
                invoiceService.getInvoiceById(invoiceId);

        try {

            ByteArrayOutputStream out =
                    new ByteArrayOutputStream();

            Document document =
                    new Document();

            PdfWriter.getInstance(document, out);

            document.open();

            Paragraph title = new Paragraph(
                    "AUTOSERVE",
                    TITLE_FONT);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            Paragraph subtitle = new Paragraph(
                    "Vehicle Service Management System",
                    NORMAL_FONT);

            subtitle.setAlignment(Element.ALIGN_CENTER);

            document.add(subtitle);

            document.add(new Paragraph(" "));
            
            PdfPTable invoiceTable = new PdfPTable(2);
            invoiceTable.setWidthPercentage(100);
            invoiceTable.setSpacingBefore(10);

            addCell(invoiceTable, "Invoice ID", true);
            addCell(invoiceTable,
                    String.valueOf(invoice.getInvoiceId()),
                    false);

            addCell(invoiceTable, "Invoice Date", true);
            addCell(invoiceTable,
                    String.valueOf(invoice.getInvoiceDate()),
                    false);

            document.add(invoiceTable);

            document.add(new Paragraph(" "));
            
            Paragraph customerHeader =
                    new Paragraph("Customer Details", HEADER_FONT);

            document.add(customerHeader);

            document.add(new Paragraph(
                    "Customer : " + invoice.getCustomerName(),
                    NORMAL_FONT));

            document.add(new Paragraph(
                    "Vehicle  : " +
                    invoice.getVehicleBrand() + " " +
                    invoice.getVehicleModel(),
                    NORMAL_FONT));

            document.add(new Paragraph(
                    "Vehicle No : " +
                    invoice.getVehicleNumber(),
                    NORMAL_FONT));

            document.add(new Paragraph(
                    "Mechanic : " +
                    invoice.getMechanicName(),
                    NORMAL_FONT));

            document.add(new Paragraph(" "));
            
            Paragraph partsHeader =
                    new Paragraph("Spare Parts", HEADER_FONT);

            document.add(partsHeader);

            PdfPTable partsTable = new PdfPTable(4);

            partsTable.setWidthPercentage(100);

            partsTable.setWidths(new float[]{5,2,2,2});

            addCell(partsTable, "Part", true);
            addCell(partsTable, "Qty", true);
            addCell(partsTable, "Unit Price", true);
            addCell(partsTable, "Subtotal", true);

            for (JobCardPartResponseDTO part : invoice.getJobCardParts()) {

                addCell(partsTable,
                        part.getPartName(),
                        false);

                addCell(partsTable,
                        String.valueOf(part.getQuantity()),
                        false);

                addCell(partsTable,
                        "₹ " + part.getUnitPrice(),
                        false);

                addCell(partsTable,
                        "₹ " + part.getSubtotal(),
                        false);
            }

            document.add(partsTable);

            document.add(new Paragraph(" "));
            
            PdfPTable summaryTable = new PdfPTable(2);

            summaryTable.setWidthPercentage(45);

            summaryTable.setHorizontalAlignment(
                    Element.ALIGN_RIGHT);

            addCell(summaryTable,"Labour",true);
            addCell(summaryTable,
                    "₹ "+invoice.getLaborCost(),
                    false);

            addCell(summaryTable,"Parts",true);
            addCell(summaryTable,
                    "₹ "+invoice.getPartsTotal(),
                    false);

            addCell(summaryTable,
                    "GST ("+invoice.getGstPercentage()+"%)",
                    true);

            addCell(summaryTable,
                    "₹ "+invoice.getGstAmount(),
                    false);

            addCell(summaryTable,"TOTAL",true);
            addCell(summaryTable,
                    "₹ "+invoice.getTotalAmount(),
                    false);

            document.add(summaryTable);

            document.add(new Paragraph(" "));
            
            Paragraph status =
                    new Paragraph(
                            "Payment Status : "
                                    + invoice.getStatus(),
                            TOTAL_FONT);

            status.setAlignment(Element.ALIGN_RIGHT);

            document.add(status);

            document.add(new Paragraph(" "));
            
            Paragraph footer =
                    new Paragraph(
                            "Thank you for choosing AutoServe!",
                            LABEL_FONT);

            footer.setAlignment(Element.ALIGN_CENTER);

            document.add(footer);

            document.close();

            return new ByteArrayResource(out.toByteArray());

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate invoice PDF.", e);

        }
    }
    
    private void addCell(
            PdfPTable table,
            String text,
            boolean header){

        PdfPCell cell =
                new PdfPCell(new Phrase(
                        text,
                        header ? LABEL_FONT : NORMAL_FONT));

        cell.setPadding(8);

        if(header){

            cell.setBackgroundColor(
                    new Color(230,230,230));

        }

        table.addCell(cell);

    }
}
package com.project.autoserve.util;

import java.math.BigDecimal;
import java.util.List;

import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.dto.invoice.InvoiceResponseDTO;
import com.project.autoserve.dto.jobcard.JobCardResponseDTO;
import com.project.autoserve.dto.jobcardpart.JobCardPartResponseDTO;
import com.project.autoserve.dto.mechanic.MechanicResponseDTO;
import com.project.autoserve.dto.payment.PaymentResponseDTO;
import com.project.autoserve.dto.sparepart.SparePartResponseDTO;
import com.project.autoserve.dto.vehicle.VehicleResponseDTO;
import com.project.autoserve.entity.Appointment;
import com.project.autoserve.entity.Invoice;
import com.project.autoserve.entity.JobCard;
import com.project.autoserve.entity.JobCardPart;
import com.project.autoserve.entity.Mechanic;
import com.project.autoserve.entity.Payment;
import com.project.autoserve.entity.SparePart;
import com.project.autoserve.entity.Vehicle;

public class MapperUtil {

    private MapperUtil() {
    }

    public static VehicleResponseDTO toVehicleResponse(Vehicle vehicle) {

        return VehicleResponseDTO.builder()
                .vehicleId(vehicle.getVehicleId())
                .vehicleType(vehicle.getVehicleType())
                .vehicleNumber(vehicle.getVehicleNumber())
                .brand(vehicle.getBrand())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .fuelType(vehicle.getFuelType())
                .build();
    }

    public static AppointmentResponseDTO toAppointmentResponse(Appointment appointment) {

    	return AppointmentResponseDTO.builder()
    	        .appointmentId(appointment.getAppointmentId())
    	        .jobId(null)
    	        .vehicleNumber(appointment.getVehicle().getVehicleNumber())
    	        .mechanicName(
    	                appointment.getMechanic() != null
    	                        ? appointment.getMechanic().getUser().getName()
    	                        : "Not Assigned")
    	        .appointmentDate(appointment.getAppointmentDate())
    	        .status(appointment.getStatus())
    	        .problemDescription(appointment.getProblemDescription())
    	        .customerName(
    	        	    appointment.getVehicle()
    	        	               .getUser()
    	        	               .getName()
    	        	)

    	        	.vehicleMake(
    	        	    appointment.getVehicle()
    	        	               .getBrand()
    	        	)

    	        	.vehicleModel(
    	        	    appointment.getVehicle()
    	        	               .getModel()
    	        	)
    	        .build();
    }

    public static MechanicResponseDTO toMechanicResponse(Mechanic mechanic) {

    	return MechanicResponseDTO.builder()
    	        .mechanicId(mechanic.getMechanicId())
    	        .name(mechanic.getUser().getName())
    	        .phone(mechanic.getUser().getPhone())
    	        .specialization(mechanic.getSpecialization())
    	        .experience(mechanic.getExperience())
    	        .availabilityStatus(mechanic.getAvailabilityStatus())
    	        .build();
    }

    public static JobCardResponseDTO toJobCardResponse(JobCard jobCard) {

    	List<JobCardPartResponseDTO> jobCardParts =
    	        jobCard.getJobCardParts()
    	                .stream()
    	                .map(MapperUtil::toJobCardPartResponse)
    	                .toList();
        
        BigDecimal partsTotal = jobCard.getJobCardParts()
                .stream()
                .map(JobCardPart::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        BigDecimal laborCost = jobCard.getLaborCost() == null
                ? BigDecimal.ZERO
                : jobCard.getLaborCost();

        return JobCardResponseDTO.builder()
                .jobId(jobCard.getJobId())
                .appointmentId(jobCard.getAppointment().getAppointmentId())

                .customerName(
                        jobCard.getAppointment()
                                .getVehicle()
                                .getUser()
                                .getName()
                )

                .vehicleNumber(
                        jobCard.getAppointment()
                                .getVehicle()
                                .getVehicleNumber()
                )

                .mechanicName(
                        jobCard.getAppointment()
                                .getMechanic() != null
                                ? jobCard.getAppointment()
                                        .getMechanic()
                                        .getUser()
                                        .getName()
                                : "Not Assigned"
                )

                .problemDescription(
                        jobCard.getAppointment()
                                .getProblemDescription()
                )

                .appointmentDate(
                        jobCard.getAppointment()
                                .getAppointmentDate()
                )
                
                .vehicleBrand(
                        jobCard.getAppointment()
                               .getVehicle()
                               .getBrand()
                )

                .vehicleModel(
                        jobCard.getAppointment()
                               .getVehicle()
                               .getModel()
                )

                .createdAt(
                        jobCard.getCreatedAt()
                )

                .inspectionNotes(jobCard.getInspectionNotes())
                .mechanicRemarks(jobCard.getMechanicRemarks())
                .estimatedCost(jobCard.getEstimatedCost())
                .workDone(jobCard.getWorkDone())
                .laborCost(laborCost)
                .partsTotal(partsTotal)
                .grandTotal(partsTotal.add(laborCost))
                .status(jobCard.getStatus())
                .jobCardParts(jobCardParts)
                .build();
    }

    public static InvoiceResponseDTO toInvoiceResponse(Invoice invoice) {

        JobCard jobCard = invoice.getJobCard();

        List<JobCardPartResponseDTO> jobCardParts = jobCard.getJobCardParts()
                .stream()
                .map(MapperUtil::toJobCardPartResponse)
                .toList();

        return InvoiceResponseDTO.builder()

                .invoiceId(invoice.getInvoiceId())
                .jobId(jobCard.getJobId())

                .customerName(
                        jobCard.getAppointment()
                                .getVehicle()
                                .getUser()
                                .getName()
                )

                .mechanicName(
                        jobCard.getAppointment()
                                .getMechanic() != null
                                ? jobCard.getAppointment()
                                        .getMechanic()
                                        .getUser()
                                        .getName()
                                : "Not Assigned"
                )

                .vehicleBrand(
                        jobCard.getAppointment()
                                .getVehicle()
                                .getBrand()
                )

                .vehicleModel(
                        jobCard.getAppointment()
                                .getVehicle()
                                .getModel()
                )

                .vehicleNumber(
                        jobCard.getAppointment()
                                .getVehicle()
                                .getVehicleNumber()
                )

                .partsTotal(invoice.getPartsTotal())
                .laborCost(invoice.getLaborCost())
                .subTotal(invoice.getSubTotal())
                .gstPercentage(invoice.getGstPercentage())
                .gstAmount(invoice.getGstAmount())
                .totalAmount(invoice.getTotalAmount())

                .invoiceDate(invoice.getInvoiceDate())
                .status(invoice.getStatus())

                .jobCardParts(jobCardParts)

                .build();
    }
    
    public static PaymentResponseDTO toPaymentResponse(Payment payment) {

        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .invoiceId(payment.getInvoice().getInvoiceId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .transactionId(payment.getTransactionId())
                .paymentStatus(payment.getPaymentStatus())
                .paymentDate(payment.getPaymentDate())
                .build();
    }
    
    public static JobCardPartResponseDTO toJobCardPartResponse(JobCardPart jobCardPart) {

        return JobCardPartResponseDTO.builder()
                .jobCardPartId(jobCardPart.getJobCardPartId())
                .jobId(jobCardPart.getJobCard().getJobId())
                .partId(jobCardPart.getSparePart().getPartId())
                .partName(jobCardPart.getSparePart().getPartName())
                .quantity(jobCardPart.getQuantity())
                .unitPrice(jobCardPart.getUnitPrice())
                .subtotal(jobCardPart.getSubtotal())
                .build();
    }
    
    public static SparePartResponseDTO toSparePartResponse(SparePart part) {

        return SparePartResponseDTO.builder()
                .partId(part.getPartId())
                .partName(part.getPartName())
                .unitPrice(part.getUnitPrice())
                .build();

    }

}
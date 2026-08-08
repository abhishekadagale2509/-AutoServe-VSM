package com.project.autoserve.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.project.autoserve.entity.Invoice;
import com.project.autoserve.entity.Payment;
import com.project.autoserve.entity.User;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByInvoice(Invoice invoice);

    boolean existsByInvoice(Invoice invoice);
    
    List<Payment> findByInvoiceIn(List<Invoice> invoices);
    
    long count();

    List<Payment> findTop5ByOrderByPaymentDateDesc();
    
    List<Payment> findByInvoiceJobCardAppointmentVehicleUser(User user);
    
    @Query("""
    		SELECT COALESCE(SUM(p.amount),0)
    		FROM Payment p
    		WHERE p.paymentStatus = com.project.autoserve.enums.PaymentStatus.SUCCESS
    		""")
    		BigDecimal getTotalRevenue();
    
    @Query("""
    		SELECT COALESCE(SUM(p.amount),0)
    		FROM Payment p
    		WHERE p.invoice.jobCard.appointment.vehicle.user = :user
    		AND p.paymentStatus = com.project.autoserve.enums.PaymentStatus.SUCCESS
    		""")
    		BigDecimal getTotalSpentByUser(User user);

}
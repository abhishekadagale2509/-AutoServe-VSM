package com.project.autoserve.service.impl;

import java.time.LocalDate;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.project.autoserve.dto.appointment.AppointmentResponseDTO;
import com.project.autoserve.dto.dashboard.AdminDashboardResponseDTO;
import com.project.autoserve.dto.dashboard.CustomerDashboardResponseDTO;
import com.project.autoserve.dto.dashboard.MechanicDashboardResponseDTO;
import com.project.autoserve.dto.payment.PaymentResponseDTO;
import com.project.autoserve.dto.servicehistory.ServiceHistoryResponseDTO;
import com.project.autoserve.entity.Appointment;
import com.project.autoserve.entity.Mechanic;
import com.project.autoserve.entity.Payment;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.AppointmentStatus;
import com.project.autoserve.enums.JobStatus;
import com.project.autoserve.enums.Role;
import com.project.autoserve.enums.UserStatus;
import com.project.autoserve.repository.AppointmentRepository;
import com.project.autoserve.repository.InvoiceRepository;
import com.project.autoserve.repository.JobCardRepository;
import com.project.autoserve.repository.MechanicRepository;
import com.project.autoserve.repository.PaymentRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.repository.VehicleRepository;
import com.project.autoserve.service.DashboardService;
import com.project.autoserve.service.ServiceHistoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;

    private final VehicleRepository vehicleRepository;

    private final AppointmentRepository appointmentRepository;

    private final JobCardRepository jobCardRepository;

    private final InvoiceRepository invoiceRepository;

    private final PaymentRepository paymentRepository;

    private final MechanicRepository mechanicRepository;
    
    private final ServiceHistoryService serviceHistoryService;
    
    
    // 1. Public Methods
    
    @Override
    public AdminDashboardResponseDTO getAdminDashboard() {
    	
    	return buildAdminDashboard();
    }

    @Override
    public CustomerDashboardResponseDTO getCustomerDashboard() {
        return buildCustomerDashboard();
    }

    @Override
    public MechanicDashboardResponseDTO getMechanicDashboard() {
        return buildMechanicDashboard();
    }
    
    // 2. Builder Methods
    
    //Admin
    
    private AdminDashboardResponseDTO buildAdminDashboard() {

        return AdminDashboardResponseDTO.builder()

                .totalCustomers(
                        userRepository.countByRole(Role.CUSTOMER))

                .totalMechanics(
                        mechanicRepository.countByUserStatus(UserStatus.ACTIVE))

                .totalVehicles(
                        vehicleRepository.count())

                .totalAppointments(
                        appointmentRepository.count())

                .pendingAppointments(
                        appointmentRepository.countByStatus(
                                AppointmentStatus.PENDING))
                
                .cancelledAppointments(
                	    appointmentRepository.countByStatus(
                	        AppointmentStatus.CANCELLED
                	    )
                	)

                .completedJobs(
                        jobCardRepository.countByStatus(
                                JobStatus.COMPLETED))

                .totalInvoices(
                        invoiceRepository.count())

                .totalPayments(
                        paymentRepository.count())

                .totalRevenue(
                        paymentRepository.getTotalRevenue())

                .recentAppointments(buildRecentAppointments())

                .recentPayments(buildRecentPayments())

                .build();
    }
    
    private List<PaymentResponseDTO> buildRecentPayments() {

        return paymentRepository
                .findTop5ByOrderByPaymentDateDesc()
                .stream()
                .map(this::mapPayment)
                .toList();
    }
    
    private List<AppointmentResponseDTO> buildRecentAppointments() {

        return appointmentRepository
                .findTop5ByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapAppointment)
                .toList();
    }
    
    //Customer
    
    private CustomerDashboardResponseDTO buildCustomerDashboard() {

        User user = getLoggedInUser();

        return CustomerDashboardResponseDTO.builder()
                .totalVehicles(vehicleRepository.countByUser(user))
                .totalAppointments(appointmentRepository.countByVehicleUser(user))
                .completedServices(jobCardRepository.countByAppointmentVehicleUser(user))
                .totalSpent(paymentRepository.getTotalSpentByUser(user))
                .upcomingAppointment(buildUpcomingAppointment(user))
                .recentServices(buildRecentServices())
                .build();
    }
    
    private List<ServiceHistoryResponseDTO> buildRecentServices() {

        return serviceHistoryService
                .getMyServiceHistory()
                .stream()
                .limit(5)
                .toList();
    }
    
    //Mechanic
    
    private MechanicDashboardResponseDTO buildMechanicDashboard() {

        User user = getLoggedInUser();

        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Mechanic not found"));

        return MechanicDashboardResponseDTO.builder()
                .assignedJobs(
                        appointmentRepository.countByMechanic(mechanic)
                )
                .completedJobs(
                        jobCardRepository.countByAppointmentMechanicAndStatus(
                                mechanic,
                                JobStatus.COMPLETED
                        )
                )
                .todayAppointments(
                        appointmentRepository.countByMechanicAndAppointmentDate(
                                mechanic,
                                LocalDate.now()
                        )
                )
                .todayAppointmentDetails(
                        buildMechanicRecentAppointments(mechanic)
                )
                .availabilityStatus(
                        mechanic.getAvailabilityStatus()
                )
                .build();
    }
    
    private List<AppointmentResponseDTO> buildMechanicRecentAppointments(
            Mechanic mechanic
    ) {

        return appointmentRepository
                .findTop5ByMechanicOrderByAppointmentDateDesc(mechanic)
                .stream()
                .map(this::mapAppointment)
                .toList();
    }
    
    //3. Helper Methods
    
    private AppointmentResponseDTO mapAppointment(Appointment appointment) {

    	return AppointmentResponseDTO.builder()

    		    .appointmentId(appointment.getAppointmentId())

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

    		    .vehicleNumber(
    		        appointment.getVehicle()
    		                   .getVehicleNumber()
    		    )

    		    .mechanicName(
    		        appointment.getMechanic() != null
    		            ? appointment.getMechanic()
    		                         .getUser()
    		                         .getName()
    		            : null
    		    )

    		    .appointmentDate(
    		        appointment.getAppointmentDate()
    		    )

    		    .status(
    		        appointment.getStatus()
    		    )

    		    .problemDescription(
    		        appointment.getProblemDescription()
    		    )

    		    .build();
    }
    
    private PaymentResponseDTO mapPayment(Payment payment) {

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
    
    private AppointmentResponseDTO buildUpcomingAppointment(User user) {

        return appointmentRepository
                .findFirstByVehicleUserAndAppointmentDateGreaterThanEqualOrderByAppointmentDateAsc(
                        user,
                        LocalDate.now()
                )
                .map(this::mapAppointment)
                .orElse(null);
    }
    

    
    
    
    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));
    }
    


}
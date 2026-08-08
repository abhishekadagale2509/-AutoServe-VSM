package com.project.autoserve.service.impl;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.project.autoserve.dto.mechanic.CreateMechanicRequestDTO;
import com.project.autoserve.dto.mechanic.MechanicResponseDTO;
import com.project.autoserve.dto.mechanic.UpdateAvailabilityRequestDTO;
import com.project.autoserve.dto.mechanic.UpdateMechanicRequestDTO;
import com.project.autoserve.entity.Mechanic;
import com.project.autoserve.entity.User;
import com.project.autoserve.enums.Role;
import com.project.autoserve.enums.UserStatus;
import com.project.autoserve.exception.DuplicateResourceException;
import com.project.autoserve.exception.ResourceNotFoundException;
import com.project.autoserve.repository.MechanicRepository;
import com.project.autoserve.repository.UserRepository;
import com.project.autoserve.service.MechanicService;
import com.project.autoserve.util.MapperUtil;
import com.project.autoserve.service.EmailService;
import com.project.autoserve.util.PasswordUtil;

@Service
public class MechanicServiceImpl implements MechanicService {

    private final MechanicRepository mechanicRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    public MechanicServiceImpl(
            MechanicRepository mechanicRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            EmailService emailService) {

        this.mechanicRepository = mechanicRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public MechanicResponseDTO addMechanic(CreateMechanicRequestDTO request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered.");
        }
        
        String tempPassword = PasswordUtil.generatePassword();

        User user = User.builder()
        		.firstLogin(true)
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(tempPassword))
                .role(Role.MECHANIC)
                .status(UserStatus.ACTIVE)
                .build();

        user = userRepository.save(user);

        Mechanic mechanic = Mechanic.builder()
                .user(user)
                .specialization(request.getSpecialization())
                .experience(request.getExperience())
                .availabilityStatus(request.getAvailabilityStatus())
                .build();

        mechanic = mechanicRepository.save(mechanic);

        try {

            emailService.sendEmail(
                    user.getEmail(),
                    "Welcome to AutoServe",
                    "Hello " + user.getName()
                            + ",\n\n"
                            + "Your mechanic account has been created successfully.\n\n"
                            + "Email: " + user.getEmail()
                            + "\n"
                            + "Temporary Password: " + tempPassword
                            + "\n\n"
                            + "Please login and change your password after your first login.\n\n"
                            + "Regards,\n"
                            + "AutoServe Team"
            );

        } catch (Exception e) {

            System.out.println("\n====================================");
            System.out.println("EMAIL COULD NOT BE SENT");
            System.out.println("Mechanic : " + user.getName());
            System.out.println("Email    : " + user.getEmail());
            System.out.println("Password : " + tempPassword);
            System.out.println("====================================\n");
        }

        return MapperUtil.toMechanicResponse(mechanic);
    }

    @Override
    public List<MechanicResponseDTO> getAllMechanics() {

        return mechanicRepository.findByUserStatus(UserStatus.ACTIVE)
                .stream()
                .map(MapperUtil::toMechanicResponse)
                .toList();

    }
    
    @Override
    public MechanicResponseDTO getMechanicById(Long mechanicId) {

        Mechanic mechanic = mechanicRepository.findById(mechanicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Mechanic not found with ID: " + mechanicId));

        return MapperUtil.toMechanicResponse(mechanic);
    }
    
    @Override
    public MechanicResponseDTO updateMechanic(
            Long mechanicId,
            UpdateMechanicRequestDTO request) {

        Mechanic mechanic = mechanicRepository.findById(mechanicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Mechanic not found with ID: " + mechanicId));

        User user = mechanic.getUser();

        // Update User details
        user.setName(request.getName());
        user.setPhone(request.getPhone());

        userRepository.save(user);

        // Update Mechanic details
        mechanic.setSpecialization(request.getSpecialization());
        mechanic.setExperience(request.getExperience());
        mechanic.setAvailabilityStatus(request.getAvailabilityStatus());

        mechanic = mechanicRepository.save(mechanic);

        return MapperUtil.toMechanicResponse(mechanic);
    }
    
    @Override
    public void deactivateMechanic(Long mechanicId) {

        Mechanic mechanic = mechanicRepository.findById(mechanicId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Mechanic not found with ID: " + mechanicId));

        User user = mechanic.getUser();

        user.setStatus(UserStatus.INACTIVE);

        userRepository.save(user);
    }
    
    @Override
    public MechanicResponseDTO updateAvailability(
            UpdateAvailabilityRequestDTO request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found."));

        Mechanic mechanic = mechanicRepository.findByUser(user)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Mechanic not found."));

        mechanic.setAvailabilityStatus(request.getAvailabilityStatus());

        mechanic = mechanicRepository.save(mechanic);

        return MapperUtil.toMechanicResponse(mechanic);
    }

}
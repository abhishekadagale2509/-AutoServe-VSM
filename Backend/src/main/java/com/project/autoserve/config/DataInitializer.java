package com.project.autoserve.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.project.autoserve.entity.User;
import com.project.autoserve.enums.Role;
import com.project.autoserve.enums.UserStatus;
import com.project.autoserve.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        if (!userRepository.existsByEmail("admin@autoserve.com")) {

            User admin = User.builder()
                    .name("System Administrator")
                    .email("admin@autoserve.com")
                    .phone("9876543210")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .status(UserStatus.ACTIVE)
                    .build();

            userRepository.save(admin);

            System.out.println("=======================================");
            System.out.println("Default Admin Created Successfully");
            System.out.println("Email : admin@autoserve.com");
            System.out.println("Password : Admin@123");
            System.out.println("=======================================");

        } else {

            System.out.println("Default Admin Already Exists.");

        }

    }

}
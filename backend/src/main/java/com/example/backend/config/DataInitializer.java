package com.example.backend.config;

import com.example.backend.Dao.AdminRepository;
import com.example.backend.Dto.AdminDto;
import com.example.backend.Entity.Admin;
import com.example.backend.Entity.Enums.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initDefautlAdmin(
            AdminRepository adminRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            String defautlAdminEmail = "youssef.khalid496@gmail.com";
            Optional<Admin> existingAdmin = adminRepository.findByEmail(defautlAdminEmail);
            if(existingAdmin.isEmpty()){
                Admin admin = new Admin();
                admin.setEmail(defautlAdminEmail);
                admin.setNom("admin");
                admin.setIs_deleted(false);
                admin.setMotdepasse(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);

                adminRepository.save(admin);
                System.out.println("User Admin par défaut créé !");
            }else {
                System.out.println("L'utilisateur Admin existe déjà.");
            }
        };
    }
}

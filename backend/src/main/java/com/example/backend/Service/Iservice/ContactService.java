package com.example.backend.Service.Iservice;

import com.example.backend.Dao.AdminRepository;
import com.example.backend.Entity.Admin;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Dto.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContactService {

    private final JavaMailSender mailSender;
    private final AdminRepository adminRepository;

    // Optionnel : email de fallback si aucun admin en BDD
    private final String fallbackAdminEmail;

    public ContactService(JavaMailSender mailSender,
                          AdminRepository adminRepository,
                          @Value("${app.contact.fallback-admin-email:}") String fallbackAdminEmail) {
        this.mailSender = mailSender;
        this.adminRepository = adminRepository;
        this.fallbackAdminEmail = fallbackAdminEmail;
    }

    public void envoyerMessage(ContactRequest req) {
        // 1) Récupérer tous les emails des admins
        List<Admin> admins = adminRepository.findAllByRole(Role.ADMIN);
        String[] to = admins.stream()
                .map(Admin::getEmail)
                .filter(e -> e != null && !e.isBlank())
                .distinct()
                .toArray(String[]::new);

        // 2) Fallback si vide
        if (to.length == 0) {
            if (fallbackAdminEmail == null || fallbackAdminEmail.isBlank()) {
                throw new IllegalStateException("Aucun email admin trouvé et aucun fallback configuré.");
            }
            to = new String[]{fallbackAdminEmail};
        }

        // 3) Construire et envoyer
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo(to); // envoie à tous les admins
        mail.setSubject("Nouveau message de contact");
        mail.setText("""
                Nom : %s
                Prénom : %s
                Email : %s
                Téléphone : %s

                Message :
                %s
                """.formatted(req.getNom(), req.getPrenom(), req.getEmail(), req.getTelephone(), req.getMessage()));

        mailSender.send(mail);
    }
}

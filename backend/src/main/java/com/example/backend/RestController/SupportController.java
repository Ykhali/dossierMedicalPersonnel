package com.example.backend.RestController;

import com.example.backend.Service.ServiceImpl.EmailService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/support")
public class SupportController {
    @Autowired private EmailService emailService;
    @PostMapping("/contacter-admin")
    public ResponseEntity<?> contacterAdmin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String message = body.getOrDefault("message", "Un utilisateur souhaite contacter l’admin.");

        // Adresse de l’admin → configure dans application.properties si besoin
        String adminEmail = "youssef.khalid496@gmail.com";

        String subject = "Demande de restauration de compte";
        String html = "<p>L’utilisateur avec l’email <b>" + email + "</b> a demandé la restauration de son compte.</p>"
                + "<p>Message : " + message + "</p>";

        emailService.sendHtml(adminEmail, subject, html);

        return ResponseEntity.ok(Map.of("status", "OK", "message", "Email envoyé à l’admin."));
    }
}

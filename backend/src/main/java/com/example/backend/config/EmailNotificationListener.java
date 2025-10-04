package com.example.backend.config;

import com.example.backend.events.UserReactivatedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

@Component
public class EmailNotificationListener {
    private final JavaMailSender mailSender;

    public EmailNotificationListener(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @EventListener
    public void onUserReactivated(UserReactivatedEvent evt) {
        if (evt.getEmail() == null || evt.getEmail().isBlank()) return;
        try {
            var msg = new SimpleMailMessage();
            msg.setTo(evt.getEmail());
            msg.setSubject("Votre compte est réactivé");
            msg.setText(
                    "Bonjour " + (evt.getPrenom() != null ? evt.getPrenom() : "") + ",\n\n" +
                            "Votre compte a été réactivé avec succès. Vous pouvez maintenant vous connecter.\n\n" +
                            "Cordialement,\nL’équipe support"
            );
            mailSender.send(msg);
        } catch (Exception e) {
            // log only; don’t fail the main flow
            System.err.println("Email send failed: " + e.getMessage());
        }
    }
}

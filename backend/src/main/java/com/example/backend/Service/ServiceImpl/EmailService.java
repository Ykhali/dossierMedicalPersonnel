package com.example.backend.Service.ServiceImpl;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/*@Service
public class EmailService {
    private final JavaMailSender mailSender;
    public EmailService(JavaMailSender mailSender) { this.mailSender = mailSender; }

    public void sendHtml(String to, String subject, String html) {
        try {
            var msg = mailSender.createMimeMessage();
            var helper = new MimeMessageHelper(msg, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            // optional: set a friendly From name (must match your Gmail address as sender)
            helper.setFrom(System.getenv("SMTP_USER"), "AloExpert PRO");
            mailSender.send(msg);
        } catch (MessagingException | java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
}*/

@Service
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from:}")
    private String fromAddress; // ex: "AloExpert PRO <no-reply@aloexpert.dev>"

    @Value("${spring.mail.username:}")
    private String mailUsername; // fallback si mail.from est vide

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtml(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");

            // 1) choisis la meilleure source pour le From
            String from = (fromAddress != null && !fromAddress.isBlank())
                    ? fromAddress
                    : mailUsername;

            // 2) sécurise : si toujours null/blank -> erreur explicite
            if (from == null || from.isBlank()) {
                throw new IllegalStateException("No 'from' address configured. Set 'mail.from' or 'spring.mail.username'.");
            }

            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Mail envoyé à {}", to);

        } catch (Exception e) {
            log.error("Erreur envoi email", e);
            throw new RuntimeException("Échec d'envoi email", e);
        }
    }
}



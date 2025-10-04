package com.example.backend.Service.ServiceImpl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class Mailer {
    private final JavaMailSender sender;
    @Value("${app.mailFrom}") String from;
    @Value("${app.mailFromAddress}") String fromAddress;
    @Value("${app.mailFromName:}")   String fromName; // optional

    /*public void send(String to, String subject, String html) {
        try {
            var helper = new MimeMessageHelper(sender.createMimeMessage(), "UTF-8");
            helper.setFrom(from);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            sender.send(helper.getMimeMessage());
        } catch (Exception e) {
            throw new RuntimeException("Email send failed", e);
        }
    }*/
    public void send(String to, String subject, String html) {
        try {
            var msg = sender.createMimeMessage();
            var helper = new MimeMessageHelper(msg, "UTF-8");

            if (fromName != null && !fromName.isBlank()) {
                helper.setFrom(new jakarta.mail.internet.InternetAddress(
                        fromAddress, fromName, java.nio.charset.StandardCharsets.UTF_8.name()));
            } else {
                helper.setFrom(fromAddress); // plain address, no display name
            }
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(html, true);
            sender.send(msg);
        } catch (Exception e) {
            throw new RuntimeException("Email send failed", e);
        }
    }
}

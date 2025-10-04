package com.example.backend.Service.Iservice;

import com.example.backend.Dao.AdminRepository;
import com.example.backend.Dto.ContactRequest;
import com.example.backend.Entity.Admin;
import com.example.backend.Entity.Enums.Role;
import jakarta.mail.internet.MimeMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.InputStream;
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ContactServiceTest {


    static class CapturingMailSender implements JavaMailSender {
        SimpleMailMessage lastMail;

        @Override public void send(SimpleMailMessage simpleMessage) { this.lastMail = simpleMessage; }

        // Méthodes non utilisées dans ce test (laisse vide)
        @Override public void send(SimpleMailMessage... simpleMessages) {}
        @Override public MimeMessage createMimeMessage() { return null; }
        @Override public MimeMessage createMimeMessage(InputStream inputStream) { return null; }
        @Override public void send(MimeMessage mimeMessage) {}
        @Override public void send(MimeMessage... mimeMessages) {}
        @Override public void send(org.springframework.mail.javamail.MimeMessagePreparator mimeMessagePreparator) {}
        @Override public void send(org.springframework.mail.javamail.MimeMessagePreparator... mimeMessagePreparators) {}
    }

    // --- Petit helper: crée un "AdminRepository" stub avec seulement findAllByRole ---
    private AdminRepository stubAdminRepoReturning(List<Admin> admins) {
        InvocationHandler handler = new InvocationHandler() {
            @Override public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
                if ("findAllByRole".equals(method.getName())) {
                    return admins;
                }
                // Tout le reste n'est pas utilisé dans ce test
                throw new UnsupportedOperationException("Method not supported in this test: " + method.getName());
            }
        };
        return (AdminRepository) Proxy.newProxyInstance(
                AdminRepository.class.getClassLoader(),
                new Class<?>[]{AdminRepository.class},
                handler
        );
    }

    @Test
    void envoyerMessage_envoieAuxAdmins() {
        // Arrange
        // 1) Repo stub qui renvoie un admin
        Admin admin = new Admin();
        admin.setEmail("admin@test.com");
        admin.setNom("Admin");
        admin.setPrenom("Admin");
        admin.setRole(Role.ADMIN);
        AdminRepository fakeRepo = stubAdminRepoReturning(List.of(admin));

        // 2) Mail sender qui capture le mail
        CapturingMailSender mailSender = new CapturingMailSender();

        // 3) Service réel avec fallback (non utilisé ici car on a un admin)
        ContactService service = new ContactService(mailSender, fakeRepo, "fallback@test.com");

        // 4) Requête de contact
        ContactRequest req = new ContactRequest();
        req.setNom("Mouadil");
        req.setPrenom("Ayoub");
        req.setEmail("user@test.com");
        req.setTelephone("0600000000");
        req.setMessage("Bonjour, test unitaire !");

        // Act
        service.envoyerMessage(req);

        // Assert
        SimpleMailMessage sent = mailSender.lastMail;
        assertNotNull(sent, "Aucun mail capturé");
        assertEquals("Nouveau message de contact", sent.getSubject());
        assertArrayEquals(new String[]{"admin@test.com"}, sent.getTo(), "Destinataires incorrects");
        // un échantillon du contenu (tu peux ajouter d'autres asserts si tu veux)
        String body = sent.getText();
        assertTrue(body.contains("Nom : Mouadil"));
        assertTrue(body.contains("Prénom : Ayoub"));
        assertTrue(body.contains("Email : user@test.com"));
        assertTrue(body.contains("Téléphone : 0600000000"));
        assertTrue(body.contains("Bonjour, test unitaire !"));
    }


}
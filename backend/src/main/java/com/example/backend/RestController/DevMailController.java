package com.example.backend.RestController;

import com.example.backend.Service.ServiceImpl.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dev")
public class DevMailController {
    private final EmailService emailService;
    public DevMailController(EmailService emailService) { this.emailService = emailService; }

    @PostMapping("/test-mail")
    public ResponseEntity<Void> test() {
        emailService.sendHtml(
                "destinataire@example.com",
                "Test From non null",
                "<h1>Hello</h1><p>Ceci est un test.</p>"
        );
        return ResponseEntity.ok().build();
    }
}

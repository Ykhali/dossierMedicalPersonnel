package com.example.backend.RestController;

import com.example.backend.Service.Iservice.ContactService;
import com.example.backend.Dto.ContactRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    private final ContactService contactService;
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<?> envoyer(@Valid @RequestBody ContactRequest request) {
        contactService.envoyerMessage(request);
        return ResponseEntity.ok().build();
    }
}

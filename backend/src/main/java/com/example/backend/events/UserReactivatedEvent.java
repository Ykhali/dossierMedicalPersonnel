package com.example.backend.events;

import org.springframework.context.ApplicationEvent;

public class UserReactivatedEvent extends ApplicationEvent {
    private final Long userId;
    private final String email;
    private final String phone;
    private final String nom;
    private final String prenom;

    public UserReactivatedEvent(Object source, Long userId, String email, String phone, String nom, String prenom) {
        super(source);
        this.userId = userId;
        this.email = email;
        this.phone = phone;
        this.nom = nom;
        this.prenom = prenom;
    }

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getNom() {
        return nom;
    }

    public String getPrenom() {
        return prenom;
    }
}

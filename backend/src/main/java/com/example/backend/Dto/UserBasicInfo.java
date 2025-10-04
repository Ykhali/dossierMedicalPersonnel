package com.example.backend.Dto;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

public class UserBasicInfo {
    Long id;
    String nom;
    String prenom;
    String telephone;
    String email;
    int passwordLength;
    LocalDateTime emailVerifiedAt;

    public UserBasicInfo(Long id,String nom, String prenom, String telephone, String email, int passwordLength, LocalDateTime emailVerifiedAt) {
        this.nom = nom;
        this.id= id;
        this.prenom = prenom;
        this.telephone = telephone;
        this.emailVerifiedAt = emailVerifiedAt;
        this.email = email;
        this.passwordLength = passwordLength;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getEmailVerifiedAt() {
        return emailVerifiedAt;
    }

    public void setEmailVerifiedAt(LocalDateTime emailVerifiedAt) {
        this.emailVerifiedAt = emailVerifiedAt;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getPasswordLength() {
        return passwordLength;
    }

    public void setPasswordLength(int passwordLength) {
        this.passwordLength = passwordLength;
    }
}

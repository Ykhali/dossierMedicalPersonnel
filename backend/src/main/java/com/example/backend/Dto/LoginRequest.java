package com.example.backend.Dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class LoginRequest {
    @NotBlank(message = "Email est obligatoire")
    @Email
    public String email;

    @NotBlank(message = "mot de passe est obligatoire")
    public String motdepasse;

    public LoginRequest() {
    }

    public LoginRequest(String email, String motDePasse) {
        this.email = email;
        this.motdepasse = motDePasse;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMotdepasse() {
        return motdepasse;
    }

    public void setMotdepasse(String motdepasse) {
        this.motdepasse = motdepasse;
    }
}

package com.example.backend.Dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class UpdateUserDto {
    private String Nom;

    private String Prenom;

    private String Email;

    private String telephone;

    public UpdateUserDto() {
    }

    public UpdateUserDto(String nom, String prenom, String email, String telephone) {
        Nom = nom;
        Prenom = prenom;
        Email = email;
        this.telephone = telephone;
    }

    public String getNom() {
        return Nom;
    }

    public void setNom(String nom) {
        Nom = nom;
    }

    public String getPrenom() {
        return Prenom;
    }

    public void setPrenom(String prenom) {
        Prenom = prenom;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
}

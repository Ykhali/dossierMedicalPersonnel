package com.example.backend.Dto;

public class BasicInfoDto {
    Long id;
    String nom;
    String cin;
    String prenom;
    String telephone;
    String email;
    int passwordLength;


    public BasicInfoDto(Long id,String cin, String nom, String prenom, String telephone, String email, int passwordLength) {
        this.id = id;
        this.cin = cin;
        this.passwordLength = passwordLength;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.email = email;

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getPasswordLength() {
        return passwordLength;
    }

    public void setPasswordLength(int passwordLength) {
        this.passwordLength = passwordLength;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
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
}

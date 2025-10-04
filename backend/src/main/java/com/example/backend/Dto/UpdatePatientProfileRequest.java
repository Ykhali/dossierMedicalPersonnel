package com.example.backend.Dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class UpdatePatientProfileRequest {

    private String cin;

    @Size(min = 1, max = 80)
    private String nom;

    @Size(min = 1, max = 80)
    private String prenom;

    private LocalDate dateNaissance;

    @Size(max = 255)
    private String adresse;

    // Exemple simple de regex internationale (+2126…, etc.)
    @Pattern(regexp = "^\\+?[0-9 ]{7,20}$", message = "Téléphone invalide")
    private String telephone;

    private String sexe;

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public LocalDate getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(LocalDate dateNaissance) {
        this.dateNaissance = dateNaissance;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }
}
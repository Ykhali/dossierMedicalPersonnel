package com.example.backend.Dto;

import java.time.LocalDate;

public class UpdateMedecinInfosRequest {
    private String cin;
    private String nom;
    private String prenom;
    private String telephone;
    private String email;
    private LocalDate datedenaissance;
    private String adresse;
    private String ville;
    private String specialite;
    private String sousSpecialites;
    private String langues;
    private String bio;
    private Double prixConsult;
    private Double prixTeleconsult;
    private String sexe;
    private Boolean acceptTeleconsult;

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

    public LocalDate getDatedenaissance() {
        return datedenaissance;
    }

    public void setDatedenaissance(LocalDate datedenaissance) {
        this.datedenaissance = datedenaissance;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getVille() {
        return ville;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getSousSpecialites() {
        return sousSpecialites;
    }

    public void setSousSpecialites(String sousSpecialites) {
        this.sousSpecialites = sousSpecialites;
    }

    public String getLangues() {
        return langues;
    }

    public void setLangues(String langues) {
        this.langues = langues;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Double getPrixConsult() {
        return prixConsult;
    }

    public void setPrixConsult(Double prixConsult) {
        this.prixConsult = prixConsult;
    }

    public Double getPrixTeleconsult() {
        return prixTeleconsult;
    }

    public void setPrixTeleconsult(Double prixTeleconsult) {
        this.prixTeleconsult = prixTeleconsult;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public Boolean getAcceptTeleconsult() {
        return acceptTeleconsult;
    }

    public void setAcceptTeleconsult(Boolean acceptTeleconsult) {
        this.acceptTeleconsult = acceptTeleconsult;
    }
}

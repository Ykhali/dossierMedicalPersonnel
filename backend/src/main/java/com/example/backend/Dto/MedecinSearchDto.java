package com.example.backend.Dto;

public class MedecinSearchDto {
    private Long id;
    private String nom;
    private String prenom;
    private String telephone;
    private String adresse;
    private String ville;
    private String specialite;
    private String sousSpecialites;
    private String Langues;
    private String bio;

    public MedecinSearchDto() {
    }

    public MedecinSearchDto(Long id, String nom, String prenom, String telephone, String adresse, String ville, String specialite, String sousSpecialites, String langues, String bio) {
        this.id = id;
        this.nom = nom;
        this.prenom = prenom;
        this.telephone = telephone;
        this.adresse = adresse;
        this.ville = ville;
        this.specialite = specialite;
        this.sousSpecialites = sousSpecialites;
        Langues = langues;
        this.bio = bio;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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
        return Langues;
    }

    public void setLangues(String langues) {
        Langues = langues;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }
}

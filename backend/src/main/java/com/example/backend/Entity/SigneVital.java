package com.example.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "signes_vitaux")
public class SigneVital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relation avec Patient
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Mesures principales

    @Column(nullable = true)
    private Double temperature;          // °C

    @Column(nullable = true)
    private String tension;              // ex: "120/80"

    @Column(nullable = true)
    private Integer frequenceRespiratoire; // respirations/min

    @Column(nullable = true)
    private Double saturationOxygene;   // % SpO2

    @Column(nullable = true)
    private Double poids;               // kg

    @Column(nullable = true)
    private Double taille;

    @Column(nullable = true)
    private String commentaire;

    public SigneVital() {
    }

    public SigneVital(Long id, Patient patient, Double temperature, String tension, Integer frequenceRespiratoire, Double saturationOxygene, Double poids, Double taille, String commentaire) {
        this.id = id;
        this.patient = patient;
        this.temperature = temperature;
        this.tension = tension;
        this.frequenceRespiratoire = frequenceRespiratoire;
        this.saturationOxygene = saturationOxygene;
        this.poids = poids;
        this.taille = taille;
        this.commentaire = commentaire;
    }

    // Getters & Setters


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getTension() {
        return tension;
    }

    public void setTension(String tension) {
        this.tension = tension;
    }

    public Integer getFrequenceRespiratoire() {
        return frequenceRespiratoire;
    }

    public void setFrequenceRespiratoire(Integer frequenceRespiratoire) {
        this.frequenceRespiratoire = frequenceRespiratoire;
    }

    public Double getSaturationOxygene() {
        return saturationOxygene;
    }

    public void setSaturationOxygene(Double saturationOxygene) {
        this.saturationOxygene = saturationOxygene;
    }

    public Double getPoids() {
        return poids;
    }

    public void setPoids(Double poids) {
        this.poids = poids;
    }

    public Double getTaille() {
        return taille;
    }

    public void setTaille(Double taille) {
        this.taille = taille;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
}

package com.example.backend.Dto;

import com.example.backend.Entity.Enums.StatusRendezVous;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Patient;
import com.example.backend.Entity.Receptionniste;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

public class HistoriqueRendezVousDto {
    private Long id;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "date_rendezVous")
    private LocalDate date;

    @Column(name = "date_creation", updatable = false)
    private LocalDate dateCreation;

    private String heure;
    private String motif;
    private Medecin medecin;

    @Enumerated(EnumType.STRING)
    private StatusRendezVous status;
    private Receptionniste receptionniste;
    private Patient patient;

    public HistoriqueRendezVousDto() {
    }

    public HistoriqueRendezVousDto( LocalDate date, LocalDate dateCreation, String heure,
                                    String motif, Medecin medecin, StatusRendezVous status,
                                    Receptionniste receptionniste, Patient patient) {
        this.date = date;
        this.dateCreation = dateCreation;
        this.heure = heure;
        this.motif = motif;
        this.medecin = medecin;
        this.status = status;
        this.receptionniste = receptionniste;
        this.patient = patient;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }

    public String getHeure() {
        return heure;
    }

    public void setHeure(String heure) {
        this.heure = heure;
    }

    public String getMotif() {
        return motif;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public StatusRendezVous getStatus() {
        return status;
    }

    public void setStatus(StatusRendezVous status) {
        this.status = status;
    }

    public Receptionniste getReceptionniste() {
        return receptionniste;
    }

    public void setReceptionniste(Receptionniste receptionniste) {
        this.receptionniste = receptionniste;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}

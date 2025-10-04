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

    @Column(name = "idrdv")
    private Long IdRDV;

    @Column(name = "date_rendezVous")
    private LocalDate date;

    @Column(name = "date_creation", updatable = false)
    private LocalDate dateCreation;

    @Column(name = "date_annulation")
    private LocalDate dateDAnnulation;

    private String heure;
    private String motif;

    private Medecin medecin;

    @Enumerated(EnumType.STRING)
    private StatusRendezVous status;
    private Patient patient;

    public HistoriqueRendezVousDto() {
    }

    public HistoriqueRendezVousDto( LocalDate date, Long IdRDV,
                                    LocalDate dateCreation, String heure,
                                    String motif, Medecin medecin,
                                    StatusRendezVous status, Patient patient) {
        this.date = date;
        this.IdRDV = IdRDV;
        this.dateCreation = dateCreation;
        this.heure = heure;
        this.motif = motif;
        this.medecin = medecin;
        this.status = status;
        this.patient = patient;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getIdRDV() {
        return IdRDV;
    }

    public void setIdRDV(Long idRDV) {
        IdRDV = idRDV;
    }

    public LocalDate getDateDAnnulation() {
        return dateDAnnulation;
    }

    public void setDateDAnnulation(LocalDate dateDAnnulation) {
        this.dateDAnnulation = dateDAnnulation;
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

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}

package com.example.backend.Dto;

import com.example.backend.Entity.Enums.StatusRendezVous;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Patient;
import com.example.backend.Entity.Receptionniste;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

public class RendezVousDto {
    private Long id;

    @JsonFormat(pattern = "dd/MM/yyyy")
    @Column(name = "date_rendezVous")
    private LocalDate date;

    @Column(name = "date_creation", updatable = false)
    private LocalDate dateCreation;

    private String heure;
    private String motif;


    @Enumerated(EnumType.STRING)
    private StatusRendezVous status;

    /*@JsonInclude(JsonInclude.Include.NON_NULL)
    private Receptionniste receptionniste;*/
    private Patient patient;

    private Medecin medecin;
    public RendezVousDto() {
    }

    public RendezVousDto(Long id, LocalDate date, String heure, String motif, Medecin medecin) {
        this.id = id;
        this.date = date;
        this.heure = heure;
        this.motif = motif;
        this.medecin = medecin;
    }
    public RendezVousDto(Long id, LocalDate date, String heure, String motif, Medecin medecin, Patient patient) {
        this.id = id;
        this.date = date;
        this.heure = heure;
        this.motif = motif;
        this.medecin = medecin;
        this.patient = patient;
    }

    public RendezVousDto(Long id, LocalDate date,LocalDate dateCreation, String heure, String motif, Medecin medecin, StatusRendezVous status, Patient patient) {
        this.id = id;
        this.date = date;
        this.heure = heure;
        this.motif = motif;
        this.medecin = medecin;
        this.dateCreation = dateCreation;
        this.status = status;
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

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }
}

package com.example.backend.Dto;

import com.example.backend.Entity.Enums.StatusRendezVous;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

public class CreateRendezVousDto {

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "date_rendezVous")
    private LocalDate date;

    @Column(name = "date_creation", updatable = false)
    private LocalDate dateCreation;

    private String heure;
    private String motif;

    @Enumerated(EnumType.STRING)
    private StatusRendezVous status;

    private Long receptionnisteId;
    private Long patientId;
    private Long medecinId;

    public CreateRendezVousDto() {
    }


    public CreateRendezVousDto(
            LocalDate date, String heure, String motif, Long medecinId, Long receptionnisteId,
            Long patientId) {
        this.date = date;
        this.heure = heure;
        this.motif = motif;
        this.medecinId = medecinId;
        this.setStatus(StatusRendezVous.En_attente);
        this.receptionnisteId = receptionnisteId;
        this.patientId = patientId;
        this.setDateCreation(LocalDate.now());
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


    public StatusRendezVous getStatus() {
        return status;
    }

    public void setStatus(StatusRendezVous status) {
        this.status = status;
    }

    public Long getMedecinId() {
        return medecinId;
    }

    public void setMedecinId(Long medecinId) {
        this.medecinId = medecinId;
    }

    public Long getReceptionnisteId() {
        return receptionnisteId;
    }

    public void setReceptionnisteId(Long receptionnisteId) {
        this.receptionnisteId = receptionnisteId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }
}

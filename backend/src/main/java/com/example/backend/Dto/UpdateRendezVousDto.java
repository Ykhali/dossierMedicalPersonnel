package com.example.backend.Dto;

import com.example.backend.Entity.Enums.StatusRendezVous;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

public class UpdateRendezVousDto {

    @Column(name = "date_rendezVous")
    private LocalDate date;

    private String heure;
    private String motif;

    @Enumerated(EnumType.STRING)
    private StatusRendezVous status;

    private Long receptionnisteId;
    private Long patientId;
    private Long medecinId;

    public UpdateRendezVousDto() {
    }

    public UpdateRendezVousDto(LocalDate date, String heure, String motif, StatusRendezVous status, Long receptionnisteId, Long patientId, Long medecinId) {
        this.date = date;
        this.heure = heure;
        this.motif = motif;
        this.status = status;
        this.receptionnisteId = receptionnisteId;
        this.patientId = patientId;
        this.medecinId = medecinId;
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

    public Long getMedecinId() {
        return medecinId;
    }

    public void setMedecinId(Long medecinId) {
        this.medecinId = medecinId;
    }
}

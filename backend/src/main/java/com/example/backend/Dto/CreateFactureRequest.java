package com.example.backend.Dto;


import java.math.BigDecimal;
import java.util.List;

public class CreateFactureRequest {
    private Long patientId;
    private Long rendezVousId;   // optionnel
    private String notes;
    private List<LigneDto> lignes;

    public static class LigneDto {
        public String description;
        public BigDecimal prix;
    }
    // getters/setters


    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public Long getRendezVousId() {
        return rendezVousId;
    }

    public void setRendezVousId(Long rendezVousId) {
        this.rendezVousId = rendezVousId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<LigneDto> getLignes() {
        return lignes;
    }

    public void setLignes(List<LigneDto> lignes) {
        this.lignes = lignes;
    }
}



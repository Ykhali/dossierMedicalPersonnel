package com.example.backend.Dto;

import java.time.LocalDate;

public class MaladieResponse {
    public Long id;
    public String label;
    public String code;
    public String systemeCode;
    public String statut;
    public String notes;
    public LocalDate dateDebut;
    public LocalDate dateFin;

    public MaladieResponse(Long id, String label, String code, String systemeCode,
                           String statut, String notes, LocalDate dateDebut, LocalDate dateFin) {
        this.id = id; this.label = label; this.code = code; this.systemeCode = systemeCode;
        this.statut = statut; this.notes = notes; this.dateDebut = dateDebut; this.dateFin = dateFin;
    }
}

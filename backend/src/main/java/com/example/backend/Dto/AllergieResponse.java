package com.example.backend.Dto;

import java.time.LocalDate;

public class AllergieResponse {
    public Long id;
    public String label;
    public String reaction;
    public String gravite;
    public String notes;
    public boolean active;
    public LocalDate dateDebut;

    public AllergieResponse(Long id, String label, String reaction, String gravite,
                            String notes, boolean active, LocalDate dateDebut) {
        this.id = id; this.label = label; this.reaction = reaction;
        this.gravite = gravite; this.notes = notes; this.active = active; this.dateDebut = dateDebut;
    }
}

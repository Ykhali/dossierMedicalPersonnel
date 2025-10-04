package com.example.backend.Dto;

import jakarta.persistence.ElementCollection;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionDto {
    private Long id;

    @ElementCollection
    private List<String> medicaments;

    private LocalDate date;

    public PrescriptionDto() {
    }

    public PrescriptionDto(Long id, List<String> medicaments, LocalDate date) {
        this.id = id;
        this.medicaments = medicaments;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<String> getMedicaments() {
        return medicaments;
    }

    public void setMedicaments(List<String> medicaments) {
        this.medicaments = medicaments;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}

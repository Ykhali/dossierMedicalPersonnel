package com.example.backend.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "prescription")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<String> medicaments;

    private LocalDate date;

    //Constructors
    public Prescription() {
    }
    public Prescription(Long id, List<String> medicaments, LocalDate date) {
        this.id = id;
        this.medicaments = medicaments;
        this.date = date;
    }

    //Getters

    public Long getId() {
        return id;
    }

    public List<String> getMedicaments() {
        return medicaments;
    }

    public LocalDate getDate() {
        return date;
    }
    //Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setMedicaments(List<String> medicaments) {
        this.medicaments = medicaments;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}

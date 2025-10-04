package com.example.backend.Entity;

import jakarta.persistence.*;
import java.time.*;

@Entity
@Table(name = "medecin_absences")
public class MedecinAbsence {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;             // absent on this date
    private LocalTime startTime;        // optional: partial day off (null = start of day)
    private LocalTime endTime;          // optional: partial day off (null = end of day)

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

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

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }
}

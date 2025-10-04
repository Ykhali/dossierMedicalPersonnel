package com.example.backend.Entity;

import jakarta.persistence.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@Table(name ="medecin_horaires" )
public class MedecinHoraire {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Either dateSpecific OR dayOfWeek must be set (not both null).
    private LocalDate dateSpecific; // e.g., 2025-09-01 for an exceptional Monday
    // Jour de la semaine (Lundi, Mardi, …)
    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    // Heure de début et de fin
    private LocalTime heureDebut;
    private LocalTime heureFin;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDateSpecific() {
        return dateSpecific;
    }

    public void setDateSpecific(LocalDate dateSpecific) {
        this.dateSpecific = dateSpecific;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getHeureDebut() {
        return heureDebut;
    }

    public void setHeureDebut(LocalTime heureDebut) {
        this.heureDebut = heureDebut;
    }

    public LocalTime getHeureFin() {
        return heureFin;
    }

    public void setHeureFin(LocalTime heureFin) {
        this.heureFin = heureFin;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }


}

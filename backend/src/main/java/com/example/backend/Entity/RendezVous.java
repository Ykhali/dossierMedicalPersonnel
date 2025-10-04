package com.example.backend.Entity;

import com.example.backend.Entity.Enums.StatusRendezVous;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.Date;

@Entity
@Table(name = "Rendez_Vous")
public class RendezVous {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date_rendezVous")
    private LocalDate date;

    @Column(name = "date_creation",updatable = false)
    private LocalDate dateCreation;

    private String heure;

    private String motif;

    @Enumerated(EnumType.STRING)
    private StatusRendezVous status;

    /*@ManyToOne
    @JoinColumn(name = "receptionniste_id")
    private Receptionniste receptionniste;*/

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    //Constructor

    public RendezVous() {
    }

    public RendezVous(Long id, LocalDate date, String heure, String motif, StatusRendezVous status) {
        this.id = id;
        this.date = date;
        this.heure = heure;
        this.motif = motif;
        this.status = status;
    }

    public RendezVous(LocalDate date, String heure, String motif, StatusRendezVous status, Medecin medecin, Patient patient) {
        this.date = date;
        this.heure = heure;
        this.motif = motif;
        this.status = status;
        this.medecin = medecin;
        this.patient = patient;
    }
    //Getters

    public Long getId() {
        return id;
    }

    public LocalDate getDate() {
        return date;
    }

    public String getHeure() {
        return heure;
    }

    public String getMotif() {
        return motif;
    }

    public StatusRendezVous getStatus() {
        return status;
    }


    public Medecin getMedecin() {
        return medecin;
    }

    public Patient getPatient() {
        return patient;
    }

    public LocalDate getDateCreation() {
        return dateCreation;
    }
    //Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public void setHeure(String heure) {
        this.heure = heure;
    }

    public void setMotif(String motif) {
        this.motif = motif;
    }

    public void setStatus(StatusRendezVous status) {
        this.status = status;
    }


    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
    }
}

package com.example.backend.Entity;

import com.example.backend.Entity.Enums.StatusRendezVous;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Date;

@Entity
public class HistoriqueRendezVous {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonFormat(pattern = "dd-MM-yyyy")
    @Column(name = "date_rendezVous")
    private LocalDate date;

    @Column(name = "date_creation",updatable = false)
    private LocalDate dateCreation;

    private String heure;

    private String motif;

    @Enumerated(EnumType.STRING)
    private StatusRendezVous status;

    @ManyToOne
    @JoinColumn(name = "receptionniste_id")
    private Receptionniste receptionniste;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    public HistoriqueRendezVous() {
    }

    public HistoriqueRendezVous(Long id, LocalDate date, LocalDate dateCreation, String heure, String motif, StatusRendezVous status, Receptionniste receptionniste, Medecin medecin, Patient patient) {
        this.id = id;
        this.date = date;
        this.dateCreation = dateCreation;
        this.heure = heure;
        this.motif = motif;
        this.status = status;
        this.receptionniste = receptionniste;
        this.medecin = medecin;
        this.patient = patient;
    }

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

    public LocalDate getDateCreation() {
        return dateCreation;
    }

    public void setDateCreation(LocalDate dateCreation) {
        this.dateCreation = dateCreation;
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

    public Receptionniste getReceptionniste() {
        return receptionniste;
    }

    public void setReceptionniste(Receptionniste receptionniste) {
        this.receptionniste = receptionniste;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}

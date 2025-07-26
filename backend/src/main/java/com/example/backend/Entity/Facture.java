package com.example.backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double montant;

    private LocalDate DateEmission;

    //constructors

    public Facture() {
    }

    public Facture(Long id, double montant, LocalDate dateEmission) {
        this.id = id;
        this.montant = montant;
        this.DateEmission = dateEmission;
    }

    //getters

    public Long getId() {
        return id;
    }

    public double getMontant() {
        return montant;
    }

    public LocalDate getDateEmission() {
        return DateEmission;
    }
    //Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public void setDateEmission(LocalDate dateEmission) {
        DateEmission = dateEmission;
    }
}

package com.example.backend.Entity;



/*
@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numero;                   // ex: FAC-2025-000123

    private double montant;

    private LocalDate dateEmission = LocalDate.now();

    @ManyToOne(optional=false) private Medecin medecin;
    @ManyToOne(optional=false) private Patient patient;

    @OneToOne(optional = true) private RendezVous rendezVous;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FactureLigne> lignes = new ArrayList<>();

    private BigDecimal montantTotal = BigDecimal.ZERO;

    private BigDecimal remise = BigDecimal.ZERO; // remise totale
    private String statut = "DRAFT";             // DRAFT | ISSUED | PAID | CANCELED

    @Column(length = 2000)
    private String notes;

    //constructors


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }



    public String getNumero() {
        return numero;
    }

    public void setNumero(String numero) {
        this.numero = numero;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public LocalDate getDateEmission() {
        return dateEmission;
    }

    public void setDateEmission(LocalDate dateEmission) {
        this.dateEmission = dateEmission;
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

    public RendezVous getRendezVous() {
        return rendezVous;
    }

    public void setRendezVous(RendezVous rendezVous) {
        this.rendezVous = rendezVous;
    }

    public List<FactureLigne> getLignes() {
        return lignes;
    }

    public void setLignes(List<FactureLigne> lignes) {
        this.lignes = lignes;
    }

    public BigDecimal getMontantTotal() {
        return montantTotal;
    }

    public void setMontantTotal(BigDecimal montantTotal) {
        this.montantTotal = montantTotal;
    }

    public BigDecimal getRemise() {
        return remise;
    }

    public void setRemise(BigDecimal remise) {
        this.remise = remise;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}*/



import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "factures")
public class Facture {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numero; // ex: FAC-2025-000123

    @Column(precision = 12, scale = 2)
    private BigDecimal montant = BigDecimal.ZERO;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateEmission = LocalDate.now();

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"factures", "rendezVous", "dossiers", "consultations"})
    private Medecin medecin;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"factures", "rendezVous", "dossiers", "consultations"})
    private Patient patient;

    @OneToOne(optional = true, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"facture", "patient", "medecin"})
    private RendezVous rendezVous;

    @OneToMany(mappedBy = "facture", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<FactureLigne> lignes = new ArrayList<>();

    @Column(precision = 12, scale = 2)
    private BigDecimal montantTotal = BigDecimal.ZERO;

    @Column(precision = 12, scale = 2)
    private BigDecimal remise = BigDecimal.ZERO;

    private String statut = "DRAFT"; // DRAFT | EN_ATTENTE | IMPRIMEE | REMIS | ISSUED | PAID | CANCELED

    @Column(length = 2000)
    private String notes;

    @Column(name = "pdf_path")
    private String pdfPath;

    // === Getters/Setters ===
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPdfPath() {
        return pdfPath;
    }

    public void setPdfPath(String pdfPath) {
        this.pdfPath = pdfPath;
    }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public BigDecimal getMontant() { return montant; }
    public void setMontant(BigDecimal montant) { this.montant = montant; }

    public LocalDate getDateEmission() { return dateEmission; }
    public void setDateEmission(LocalDate dateEmission) { this.dateEmission = dateEmission; }

    public Medecin getMedecin() { return medecin; }
    public void setMedecin(Medecin medecin) { this.medecin = medecin; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public RendezVous getRendezVous() { return rendezVous; }
    public void setRendezVous(RendezVous rendezVous) { this.rendezVous = rendezVous; }

    public List<FactureLigne> getLignes() { return lignes; }
    public void setLignes(List<FactureLigne> lignes) {
        this.lignes = lignes != null ? lignes : new ArrayList<>();
        for (FactureLigne l : this.lignes) {
            if (l != null) l.setFacture(this);
        }
        recalcMontantTotal();
    }

    public BigDecimal getMontantTotal() { return montantTotal; }
    public void setMontantTotal(BigDecimal montantTotal) { this.montantTotal = montantTotal; }

    public BigDecimal getRemise() { return remise; }
    public void setRemise(BigDecimal remise) {
        this.remise = (remise != null ? remise : BigDecimal.ZERO);
        recalcMontantTotal();
    }

    public String getStatut() { return statut; }
    public void setStatut(String statut) { this.statut = statut; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    // === Helpers ===
    public void addLigne(FactureLigne ligne) {
        if (ligne == null) return;
        ligne.setFacture(this);
        this.lignes.add(ligne);
        recalcMontantTotal();
    }

    public void removeLigne(FactureLigne ligne) {
        if (ligne == null) return;
        this.lignes.remove(ligne);
        recalcMontantTotal();
    }

    /** Recalcule total = somme(prix) - remise */
    public void recalcMontantTotal() {
        BigDecimal sum = BigDecimal.ZERO;
        if (lignes != null) {
            for (FactureLigne l : lignes) {
                if (l != null && l.getPrix() != null) {
                    sum = sum.add(l.getPrix());
                }
            }
        }
        BigDecimal rem = (remise != null ? remise : BigDecimal.ZERO);
        if (rem.compareTo(sum) > 0) rem = sum;
        this.montantTotal = sum.subtract(rem);
    }
}
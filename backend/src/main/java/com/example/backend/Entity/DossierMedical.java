package com.example.backend.Entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "dossier_medical")
public class DossierMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 1 dossier par patient */
    @OneToOne
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;

    /** Version simple : texte libre (tu pourras normaliser plus tard) */
    /*@Column(columnDefinition = "text")
    private String allergies;

    @Column(columnDefinition = "text")
    private String maladies;*/

    @OneToMany
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private List<Allergie> allergies = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private List<Maladie> maladies = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private List<SigneVital> signesVitaux = new ArrayList<>();

    @OneToMany
    @JoinColumn(name = "patient_id", referencedColumnName = "patient_id")
    private List<TraitementEnCours> traitementEnCours = new ArrayList<>();

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    // --- CTORS ---
    public DossierMedical() {}
    public DossierMedical(Patient patient) { this.patient = patient; }

    // --- GETTERS ---
    public Long getId() { return id; }
    public Patient getPatient() { return patient; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public List<SigneVital> getSignesVitaux() {
        return signesVitaux;
    }

    public List<Allergie> getAllergies() {
        return allergies;
    }

    public List<Maladie> getMaladies() {
        return maladies;
    }

    public List<TraitementEnCours> getTraitementEnCours() {
        return traitementEnCours;
    }

    // --- SETTERS ---
    public void setId(Long id) { this.id = id; }
    public void setPatient(Patient patient) { this.patient = patient; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public void setSignesVitaux(List<SigneVital> signesVitaux) {
        this.signesVitaux = signesVitaux;
    }

    public void setAllergies(List<Allergie> allergies) {
        this.allergies = allergies;
    }

    public void setMaladies(List<Maladie> maladies) {
        this.maladies = maladies;
    }

    public void setTraitementEnCours(List<TraitementEnCours> traitementEnCours) {
        this.traitementEnCours = traitementEnCours;
    }
}

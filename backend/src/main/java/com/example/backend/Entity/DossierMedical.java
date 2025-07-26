package com.example.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dossier_medical")
public class DossierMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String allergies;

    private String maladies;

    //Constructors
    public DossierMedical() {
    }
    public DossierMedical(Long id, String allergies, String maladies) {
        this.id = id;
        this.allergies = allergies;
        this.maladies = maladies;
    }

    //Getters

    public Long getId() {
        return id;
    }

    public String getAllergies() {
        return allergies;
    }

    public String getMaladies() {
        return maladies;
    }

    //Setters

    public void setId(Long id) {
        this.id = id;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public void setMaladies(String maladies) {
        this.maladies = maladies;
    }
}

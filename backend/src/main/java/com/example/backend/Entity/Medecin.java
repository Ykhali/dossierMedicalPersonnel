package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Role;
import jakarta.persistence.*;

@Entity
@Table(name = "medecins")
public class Medecin extends User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialite;

    private String sexe;

    //Constructors

    public Medecin() {
    }

    public Medecin(Long id, String nom, String prenom, String email, String motDePasse, String confirmePasse, String telephone, String specialite, String sexe) {
        super(id, nom, prenom, email, motDePasse, confirmePasse, telephone);
        this.specialite = specialite;
        this.sexe = sexe;
        this.id = id;
        super.setRole(Role.MEDECIN);
    }

    //Getters
    public String getSpecialite() {
        return specialite;
    }

    public String getSexe() {
        return sexe;
    }

    @Override
    public Long getId() {
        return id;
    }

    //Setters
    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }
}

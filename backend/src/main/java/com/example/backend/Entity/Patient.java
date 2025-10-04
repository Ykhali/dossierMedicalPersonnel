package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.Enums.Sexe;
import jakarta.persistence.*;

@Entity
@Table(name = "patients")
public class Patient extends User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String adresse;

    private String sexe;



    //Constructors
    public Patient() {
    }

    public Patient(Long id,String CIN, String nom, String prenom,
                   String email, String motDePasse,
                   String telephone, String adresse, String sexe) {
        super(id,CIN, nom, prenom, email, motDePasse, telephone);
        this.adresse = adresse;
        this.sexe = sexe;
        this.id = id;
        super.setRole(Role.PATIENT);
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getEmail() {
        return super.getEmail();
    }

}

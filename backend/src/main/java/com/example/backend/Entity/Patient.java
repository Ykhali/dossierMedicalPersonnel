package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Role;
import jakarta.persistence.*;

@Entity
@Table(name = "patients")
public class Patient extends User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String adresse;

    @ManyToOne
    private RendezVous rendezVous;

    @OneToOne
    private HistoriqueRendezVous historiqueRendezVous;

    //Constructors
    public Patient() {
    }

    public Patient(Long id, String nom, String prenom,
                   String email, String motDePasse, String confirmePasse,
                   String telephone, String adresse) {
        super(id, nom, prenom, email, motDePasse, confirmePasse, telephone);
        this.adresse = adresse;
        this.id = id;
        super.setRole(Role.PATIENT);
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
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

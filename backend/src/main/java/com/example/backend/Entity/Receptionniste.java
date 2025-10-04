package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "receptionnistes")
public class Receptionniste extends User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    private List<RendezVous> rendezVousList;

    @ManyToMany(mappedBy = "receptionnistes")
    private Set<Medecin> medecins = new HashSet<>();

    public Receptionniste() {
    }

    public Receptionniste(Long id,String CIN, String nom, String prenom,
                          String email, String motDePasse, String telephone) {
        super(id,CIN, nom, prenom, email, motDePasse, telephone);
        this.id = id;
        super.setRole(Role.RECEPTIONNISTE);
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public Set<Medecin> getMedecins() {
        return medecins;
    }

    public void setMedecins(Set<Medecin> medecins) {
        this.medecins = medecins;
    }
}

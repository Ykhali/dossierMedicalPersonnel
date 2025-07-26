package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Role;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "receptionnistes")
public class Receptionniste extends User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany
    private List<RendezVous> rendezVousList;

    public Receptionniste() {
    }

    public Receptionniste(Long id, String nom, String prenom, String email, String motDePasse, String confirmePasse, String telephone) {
        super(id, nom, prenom, email, motDePasse, confirmePasse, telephone);
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
}

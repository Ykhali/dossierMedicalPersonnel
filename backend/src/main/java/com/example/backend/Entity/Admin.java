package com.example.backend.Entity;


import com.example.backend.Entity.Enums.Role;
import jakarta.persistence.*;

@Entity
@Table(name = "admins")
public class Admin extends User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Constructors

    public Admin() {
    }

    public Admin(Long id,String CIN, String nom, String prenom, String email, String motDePasse, String telephone) {
        super(id,CIN, nom, prenom, email, motDePasse, telephone);
        this.id = id;
        super.setRole(Role.ADMIN);
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

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

    public Admin(Long id, String nom, String prenom, String email, String motDePasse, String confirmePasse, String telephone) {
        super(id, nom, prenom, email, motDePasse, confirmePasse, telephone);
        this.id = id;
        super.setRole(Role.ADMIN);
    }
}

package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Role;
import jakarta.persistence.*;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String Nom;

    private String Prenom;

    private String email;

    private String MotDePasse;

    private String ConfirmPwd;

    private String telephone;

    @Enumerated(EnumType.STRING)
    private Role role;

    //Constructors
    public User() {
    }
    public User(Long id, String nom, String prenom, String email, String motDePasse, String confirmePasse, String telephone) {
        this.id = id;
        Nom = nom;
        Prenom = prenom;
        this.email = email;
        MotDePasse = motDePasse;
        this.ConfirmPwd = confirmePasse;
        this.telephone = telephone;
    }

    //Getters
    public Long getId() {
        return id;
    }
    public String getNom() {
        return Nom;
    }
    public String getPrenom() {
        return Prenom;
    }
    public String getEmail() {
        return this.email;
    }
    public String getMotDePasse() {
        return MotDePasse;
    }
    public String getTelephone() {
        return telephone;
    }

    public String getConfirmPwd() {
        return ConfirmPwd;
    }

    public Role getRole() {
        return role;
    }

    //Setters
    public void setId(Long id) {
        this.id = id;
    }
    public void setNom(String nom) {
        Nom = nom;
    }
    public void setPrenom(String prenom) {
        Prenom = prenom;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setMotDePasse(String motDePasse) {
        MotDePasse = motDePasse;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public void setConfirmPwd(String confirmPwd) {
        ConfirmPwd = confirmPwd;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}

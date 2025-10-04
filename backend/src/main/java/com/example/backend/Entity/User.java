package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "cin",unique = true)
    private String cin;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String Nom;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String Prenom;

    private String nomComplet = Nom + " " + Prenom;
    @Column(unique = true)
    private String email;

    @Column(name = "motdepasse", nullable = false, length = 100)
    private String motdepasse;

    @Column(name = "password_length", nullable = true)
    private Integer passwordlength;

    @Column(name = "datedenaissance")
    private LocalDate datedenaissance;


    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String telephone;


    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "is_deleted")
    private boolean deleted = false;

    @Column(name = "email_verified_at")
    private LocalDateTime emailVerifiedAt;

    public boolean isEmailVerified() {
        return emailVerifiedAt != null;
    }


    //====== Photo d'identité (BLOB) =======
    //@Lob //Large object
    /*@Basic(fetch = FetchType.LAZY) // pour ne pas charger le BLOB partout
    @Column(name = "photo_identite", columnDefinition = "BYTEA")
    @JsonIgnore
    private byte[] photoIdentite;

    @JsonIgnore
    private String photoContentType;

    @JsonIgnore
    private String photoFilename;

    @JsonIgnore
    private Long photoSize;*/

    @Column(nullable = true)
    private String image;
    //==========================================

    //Constructors
    public User() {
    }
    public User(Long id, String cin,String nom, String prenom, String email, String motDePasse, String telephone) {
        this.id = id;
        Nom = nom;
        this.cin = cin;
        Prenom = prenom;
        this.email = email;
        motdepasse = motDePasse;
        this.telephone = telephone;
    }
    public User(Long id, String cin,String nom, String prenom, String image, String email, String motDePasse, String telephone) {
        this.id = id;
        Nom = nom;
        this.cin = cin;
        Prenom = prenom;
        this.image = image;
        this.email = email;
        motdepasse = motDePasse;
        this.telephone = telephone;
    }

    //Getters
    public Long getId() {
        return id;
    }

    public boolean getDeleted() {
        return deleted;
    }

    public String getNomComplet() {
        return nomComplet;
    }

    public LocalDateTime getEmailVerifiedAt() {
        return emailVerifiedAt;
    }

    public String getImage() {
        return image;
    }
    public LocalDate getDatedenaissance() {
        return datedenaissance;
    }
    public Integer getPasswordlength() {
        return passwordlength;
    }
    public String getCin() {return cin;}
    public String getNom() {
        return Nom;
    }
    public String getPrenom() {
        return Prenom;
    }
    public String getEmail() {
        return this.email;
    }
    public String getTelephone() {
        return telephone;
    }
    public String getMotdepasse() {
        return motdepasse;
    }

    public Role getRole() {
        return role;
    }

    //Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setIs_deleted(boolean is_deleted) {
        this.deleted = is_deleted;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setEmailVerifiedAt(LocalDateTime emailVerifiedAt) {
        this.emailVerifiedAt = emailVerifiedAt;
    }

    public void setDatedenaissance(LocalDate datedenaissance) {
        this.datedenaissance = datedenaissance;
    }
    public void setPasswordlength(Integer passwordlength) {
        this.passwordlength = passwordlength;
    }
    public void setCin(String cin) {this.cin = cin;}
    public void setNom(String nom) {
        Nom = nom;
    }
    public void setPrenom(String prenom) {
        Prenom = prenom;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }
    public void setMotdepasse(String motdepasse) {
        this.motdepasse = motdepasse;
    }
    public void setRole(Role role) {
        this.role = role;
    }
}

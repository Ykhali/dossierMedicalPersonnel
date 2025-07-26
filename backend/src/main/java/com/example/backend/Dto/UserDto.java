package com.example.backend.Dto;

import com.example.backend.Entity.Enums.Role;
import com.example.backend.validation.Lowercase;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserDto {

    @JsonIgnore
    private Long id;

    @NotBlank(message = "Nom est Obligatoire")
    private String Nom;

    @NotBlank(message = "Prenom est Obligatoire")
    private String Prenom;

    @NotBlank(message = "Email est Obligatoire")
    @Email(message = "Email doit être valide")
    @Lowercase(message = "Email doit être en minuscule")
    @Column(unique = true)
    private String Email;

    @NotBlank(message = "Mot de Passe est obligatoire")
    @Size(min = 6, message = "Le mot de passe doit comporter au moins 6 caractères")
    private String MotDePasse;

    private String ConfirmPwd;

    @Size(min = 8, max = 16)
    private String telephone;

    @Enumerated(EnumType.STRING)
    private Role role;

    public UserDto() {
    }

    public UserDto(Long id, String nom, String prenom, String email
            , String telephone) {
        this.id = id;
        this.Nom = nom;
        this.Prenom = prenom;
        this.Email = email;
        this.telephone = telephone;
    }

    public UserDto(Long id, String nom, String prenom, String email,
                   String motDePasse,String confirmPwd, String telephone) {
            this.id = id;
            Nom = nom;
            Prenom = prenom;
            Email = email;
            MotDePasse = motDePasse;
            this.ConfirmPwd = confirmPwd;
            this.telephone = telephone;
    }

    public UserDto(String nom, String prenom, String email, String motDePasse, String confirmPwd, String telephone) {
        Nom = nom;
        Prenom = prenom;
        Email = email;
        MotDePasse = motDePasse;
        ConfirmPwd = confirmPwd;
        this.telephone = telephone;
    }
    public UserDto(String nom, String prenom, String email,  String telephone) {
        Nom = nom;
        Prenom = prenom;
        Email = email;
        this.telephone = telephone;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return Nom;
    }

    public void setNom(String nom) {
        Nom = nom;
    }

    public String getPrenom() {
        return Prenom;
    }

    public void setPrenom(String prenom) {
        Prenom = prenom;
    }

    public String getEmail() {
        return Email;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public String getMotDePasse() {
        return MotDePasse;
    }

    public void setMotDePasse(String motDePasse) {
        MotDePasse = motDePasse;
    }

    public String getConfirmPwd() {
        return ConfirmPwd;
    }

    public void setConfirmPwd(String confirmPwd) {
        ConfirmPwd = confirmPwd;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}

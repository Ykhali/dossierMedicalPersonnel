package com.example.backend.Dto;

import com.example.backend.Entity.Enums.Role;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public class RegisterUserRequest {
    private Long Id;

    @Column(name = "cin",unique=true)
    private String cin;

    private String nom;
    private String prenom;

    @Column(unique=true)
    @Email(message = "veuillez saisir un email valide")
    private String email;
    private String motdepasse;
    private String telephone;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String confirmpwd;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = true)
    @JsonIgnore
    private MultipartFile image;

    @JsonAlias({"dateNaissance","date_de_naissance","datedenaissance"})
    private LocalDate datedenaissance;


    public RegisterUserRequest() {
    }

    public RegisterUserRequest(Long id,String CIN, String nom, String prenom,
                               String email, String password,
                               String confirmpwd, String telephone, LocalDate dateDeNaissance) {
        this.Id = id;
        this.cin = CIN;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.motdepasse = password;
        this.confirmpwd = confirmpwd;
        this.datedenaissance = dateDeNaissance;
        this.telephone = telephone;
        this.setRole(Role.PATIENT);
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long id) {
        Id = id;
    }

    public MultipartFile getImage() {
        return image;
    }

    public void setImage(MultipartFile image) {
        this.image = image;
    }

    public LocalDate getDatedenaissance() {
        return datedenaissance;
    }

    public void setDatedenaissance(LocalDate datedenaissance) {
        this.datedenaissance = datedenaissance;
    }

    public String getCin() {
        return cin;
    }

    public void setCin(String cin) {
        this.cin = cin;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return telephone;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public String getMotdepasse() {
        return motdepasse;
    }

    public void setMotdepasse(String motdepasse) {
        this.motdepasse = motdepasse;
    }

    public String getConfirmpwd() {
        return confirmpwd;
    }

    public void setConfirmpwd(String confirmpwd) {
        this.confirmpwd = confirmpwd;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}

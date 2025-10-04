package com.example.backend.Dto;

import com.example.backend.Entity.Enums.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class AddPatientDto extends RegisterUserRequest{

    private Long Id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String adresse;

    private String sexe;



    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateDeCreation;


    public AddPatientDto() {
        super();
    }

    public AddPatientDto(Long id, String CIN, String nom, String prenom,
                         String email, String motDePasse, String confirmPwd,
                         String telephone, LocalDate dateDeNaissance, String address, String sexe) {
        super(id,CIN, nom, prenom, email, motDePasse,confirmPwd, telephone, dateDeNaissance);
        super.setRole(Role.PATIENT);
        this.sexe = sexe;
        Id = id;
        this.adresse = address;
    }

    @Override
    public Long getId() {
        return Id;
    }

    @Override
    public void setId(Long id) {
        Id = id;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public LocalDateTime getDateDeCreation() {
        return dateDeCreation;
    }

    public void setDateDeCreation(LocalDateTime dateDeCreation) {
        this.dateDeCreation = dateDeCreation;
    }

}

package com.example.backend.Dto;

import com.example.backend.Entity.Enums.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

public class AddPatientDto extends UserDto{

    private Long Id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String adresse;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateDeCreation;

    public AddPatientDto() {
        super();
    }

    public AddPatientDto(Long id, String nom, String prenom, String email, String motDePasse, String confirmPwd, String telephone, String address) {
        super(id, nom, prenom, email, motDePasse,confirmPwd, telephone);
        super.setRole(Role.PATIENT);
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

package com.example.backend.Dto;

import com.example.backend.Entity.Enums.Role;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

public class PatientDto extends UserDto {

    //@JsonIgnore
    private Long id;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String adresse;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateDeCreation;


    public PatientDto() {
    }

    public PatientDto(Long id,String CIN, String nom, String prenom, String email,
                      String telephone, String adresse) {
        super(id,CIN,nom,prenom,email,telephone);
        this.id = id;
        this.adresse = adresse;
        super.setRole(Role.PATIENT);
    }

    public PatientDto(long l, String aya) {
        this.id = l;
        this.setNom(aya);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getName() {
        return super.getNom();
    }
}

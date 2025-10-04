package com.example.backend.Dto;

import org.springframework.cglib.core.Local;

import java.time.LocalDate;

public class AddMedecinDto extends RegisterUserRequest{
    private Long id;

    private String specialite;

    private String sexe;

    public AddMedecinDto() {
        super();
    }

    public AddMedecinDto(Long id, String CIN, String nom, String prenom, String email, String motDePasse, String confirmPwd, String telephone, LocalDate dateNaiss, String specialite, String sexe) {
        super(id,CIN, nom, prenom, email, motDePasse,confirmPwd, telephone, dateNaiss);
        this.id = id;
        this.specialite = specialite;
        this.sexe = sexe;
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }
}

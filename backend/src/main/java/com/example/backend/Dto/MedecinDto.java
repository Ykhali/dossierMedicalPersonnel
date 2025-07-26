package com.example.backend.Dto;

import com.example.backend.Entity.Enums.Role;

public class MedecinDto extends UserDto {
    private Long id;

    private String specialite;

    private String sexe;


    public MedecinDto( Long id ,String nom, String prenom, String email, String motDePasse, String confirmPwd, String telephone, String specialite, String sexe) {
        super(id, nom, prenom, email, motDePasse, confirmPwd, telephone);
        super.setRole(Role.MEDECIN);
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

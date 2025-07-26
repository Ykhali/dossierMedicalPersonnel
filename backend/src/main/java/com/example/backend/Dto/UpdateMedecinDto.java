package com.example.backend.Dto;

public class UpdateMedecinDto extends UpdateUserDto{

    private String specialite;
    private String sexe;

    public UpdateMedecinDto() {
        super();
    }

    public UpdateMedecinDto(String nom, String prenom, String email, String telephone, String specialite, String sexe) {
        super(nom, prenom, email, telephone);
        this.specialite = specialite;
        this.sexe = sexe;
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

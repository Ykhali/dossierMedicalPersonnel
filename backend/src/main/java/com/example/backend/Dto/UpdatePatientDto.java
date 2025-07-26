package com.example.backend.Dto;

public class UpdatePatientDto extends UpdateUserDto{
    private String adresse;

    public UpdatePatientDto() {
    }

    public UpdatePatientDto( String nom, String prenom, String email, String telephone, String adresse) {
        super( nom, prenom, email, telephone);
        this.adresse = adresse;

    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }
}

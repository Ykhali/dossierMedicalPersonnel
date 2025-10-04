package com.example.backend.Dto;

import java.util.List;

public class DossierMedicalResponse {
    public Long patientId;
    public String nom;
    public String prenom;
    public String email;
    public String telephone;

    public List<AllergieResponse> allergies;
    public List<MaladieResponse> maladies;

    public DossierMedicalResponse(Long patientId, String nom, String prenom,
                                  String email, String telephone,
                                  List<AllergieResponse> allergies,
                                  List<MaladieResponse> maladies) {
        this.patientId = patientId;
        this.nom = nom;
        this.prenom = prenom;
        this.email = email;
        this.telephone = telephone;
        this.allergies = allergies;
        this.maladies = maladies;
    }
}

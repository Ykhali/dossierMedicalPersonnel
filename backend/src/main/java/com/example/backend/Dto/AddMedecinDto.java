package com.example.backend.Dto;

public class AddMedecinDto extends UserDto{
    private Long id;

    private String specialite;

    private String sexe;

    public AddMedecinDto() {
        super();
    }

    public AddMedecinDto(Long id, String nom, String prenom, String email, String motDePasse, String confirmPwd, String telephone,  String specialite, String sexe) {
        super(nom, prenom, email, motDePasse, confirmPwd, telephone);
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

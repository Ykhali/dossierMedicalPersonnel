package com.example.backend.Dto;


public class AddReceptionnisteDto extends UserDto {
    private Long id;

    public AddReceptionnisteDto() {
        super();
    }

    public AddReceptionnisteDto(Long id, String nom, String prenom, String email, String motDePasse, String confirmPwd, String telephone) {
        super(id, nom, prenom, email, motDePasse, confirmPwd, telephone);
        this.id = id;
    }

    @Override
    public Long getId() {
        return id;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }
}

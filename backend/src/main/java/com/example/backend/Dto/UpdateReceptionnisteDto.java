package com.example.backend.Dto;

public class UpdateReceptionnisteDto extends UpdateUserDto{
    public UpdateReceptionnisteDto() {
        super();
    }

    public UpdateReceptionnisteDto(String nom, String prenom, String email, String telephone) {
        super(nom, prenom, email, telephone);
    }

}

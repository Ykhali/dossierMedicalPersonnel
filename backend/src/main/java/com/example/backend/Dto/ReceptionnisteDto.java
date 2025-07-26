package com.example.backend.Dto;

import com.example.backend.Entity.Enums.Role;

public class ReceptionnisteDto extends UserDto {
    private Long id;

    public ReceptionnisteDto() {
        super();
    }

    public ReceptionnisteDto(Long id, String nom, String prenom, String email, String motDePasse, String confirmPwd, String telephone) {
        super(id, nom, prenom, email, motDePasse, confirmPwd, telephone);
        super.setRole(Role.RECEPTIONNISTE);
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

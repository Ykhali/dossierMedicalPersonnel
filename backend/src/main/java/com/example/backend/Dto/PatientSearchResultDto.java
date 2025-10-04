package com.example.backend.Dto;

public record PatientSearchResultDto(
        Long id,
        String nom,
        String prenom,
        String cin,
        String telephone,
        String email,
        Integer age
) {}

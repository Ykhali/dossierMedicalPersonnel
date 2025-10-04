package com.example.backend.Dto;

public record PatientFolderDTO(
        String cin,
        String patientNomComplet,
        long facturesCount,
        long ordonnancesCount
) {}
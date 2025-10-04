package com.example.backend.Dto;

import java.util.List;

public record YearDocsDTO(
        String cin,
        String patientNomComplet,
        int year,
        List<DocDTO> factures,
        List<DocDTO> ordonnances
) {}

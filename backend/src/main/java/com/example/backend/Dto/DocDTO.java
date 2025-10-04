package com.example.backend.Dto;

import java.time.LocalDate;

public record DocDTO(
        Long id,
        String numero,       // numeroOrdonnance ou numeroFacture
        LocalDate date,
        String fileUrl       // URL publique pour ouvrir le PDF
) {}

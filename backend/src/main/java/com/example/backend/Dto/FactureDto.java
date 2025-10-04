package com.example.backend.Dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public record FactureDto(
        Long id,
        String numero,
        LocalDate dateEmission,
        LocalDate dateEcheance,
        BigDecimal totalHT,
        BigDecimal totalTVA,
        BigDecimal totalTTC,
        String statut,
        String pdfUrl
) {}
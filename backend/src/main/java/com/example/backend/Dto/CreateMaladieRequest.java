package com.example.backend.Dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class CreateMaladieRequest {
    @NotBlank
    public String label;
    public String code;
    public String systemeCode;
    public LocalDate dateDebut;
    public String notes;
}
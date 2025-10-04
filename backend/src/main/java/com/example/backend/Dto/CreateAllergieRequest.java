package com.example.backend.Dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public class CreateAllergieRequest {
    @NotBlank
    public String label;
    public String reaction;
    public String gravite;
    public LocalDate dateDebut;
    public String notes;
}

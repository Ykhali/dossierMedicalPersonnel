package com.example.backend.Dto;

import java.time.LocalDate;

public class UpdateMaladieRequest {
    public String label;
    public String code;
    public String systemeCode;
    public LocalDate dateFin;
    public String statut;  // "active" | "resolue" | "remission"
    public String notes;
}
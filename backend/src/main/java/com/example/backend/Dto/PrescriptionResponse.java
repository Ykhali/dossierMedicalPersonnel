package com.example.backend.Dto;

import java.time.LocalDate;
import java.util.List;

public class PrescriptionResponse {
    public Long id;
    public String patientNom;
    public LocalDate date;
    public List<String> medicaments;
}

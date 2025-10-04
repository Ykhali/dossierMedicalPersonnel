package com.example.backend.Dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class CreatePrescriptionRequest {

    @NotNull(message = "Le patient est obligatoire")
    private Long patientId;                      // Patient cible

    // Optionnels côté saisie (tu peux aussi les ignorer et les générer serveur)
    private String numeroOrdonnance;             // Généré serveur recommandé
    private LocalDate dateValidite;              // Ex : +3 mois
    //private String note;                         // Observations générales (si besoin)

    @NotEmpty(message = "Au moins une ligne de prescription est requise")
    private List<LigneDto> lignes;               // Détail des médicaments

    // ---- Getters / Setters ----
    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getNumeroOrdonnance() { return numeroOrdonnance; }
    public void setNumeroOrdonnance(String numeroOrdonnance) { this.numeroOrdonnance = numeroOrdonnance; }

    public LocalDate getDateValidite() { return dateValidite; }
    public void setDateValidite(LocalDate dateValidite) { this.dateValidite = dateValidite; }

    public List<LigneDto> getLignes() { return lignes; }
    public void setLignes(List<LigneDto> lignes) { this.lignes = lignes; }

    // ================= Lignes =================
    public static class LigneDto {

        @NotBlank(message = "Le nom du médicament est obligatoire")
        private String nomMedicament;

        @NotBlank(message = "Le dosage est obligatoire")
        private String dosage;          // ex: "500 mg"

        @NotBlank(message = "La posologie est obligatoire")
        private String posologie;       // ex: "2 fois/jour"

        @PositiveOrZero(message = "La durée doit être >= 0")
        private Integer duree;          // en jours (peut être 0 si prise unique)

        private String instructions;    // ex: "après repas", "éviter alcool", etc.

        // ---- Getters / Setters ----
        public String getNomMedicament() { return nomMedicament; }
        public void setNomMedicament(String nomMedicament) { this.nomMedicament = nomMedicament; }

        public String getDosage() { return dosage; }
        public void setDosage(String dosage) { this.dosage = dosage; }

        public String getPosologie() { return posologie; }
        public void setPosologie(String posologie) { this.posologie = posologie; }

        public Integer getDuree() { return duree; }
        public void setDuree(Integer duree) { this.duree = duree; }

        public String getInstructions() { return instructions; }
        public void setInstructions(String instructions) { this.instructions = instructions; }
    }
}
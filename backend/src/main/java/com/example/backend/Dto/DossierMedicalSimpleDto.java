package com.example.backend.Dto;

import com.example.backend.Entity.Allergie;
import com.example.backend.Entity.Maladie;
import com.example.backend.Entity.SigneVital;
import com.example.backend.Entity.TraitementEnCours;

import java.util.List;

public record DossierMedicalSimpleDto(
        Long patientId,
        String nom,
        String prenom,
        String cin,
        String dateNaissance,
        String telephone,
        String email,
        String photoUrl,
        List<Allergie> allergies,
        List<Maladie> maladies,
        List<SigneVital> signesVitaux,
        List<TraitementEnCours> traitements
) { }

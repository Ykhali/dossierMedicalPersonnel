package com.example.backend.Service.Iservice;

import com.example.backend.Entity.Medecin;

import java.util.List;

public interface MedecinService {
    Medecin getMedecinById(Long id);
    Medecin saveMedecin(Medecin medecin);
    Medecin updateMedecin(Medecin medecin);
    void deleteMedecin(Long id);
    List<Medecin> getAllMedecin();
}

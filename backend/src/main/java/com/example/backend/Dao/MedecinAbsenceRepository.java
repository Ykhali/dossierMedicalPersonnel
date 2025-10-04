package com.example.backend.Dao;

import com.example.backend.Entity.MedecinAbsence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface MedecinAbsenceRepository extends JpaRepository<MedecinAbsence, Long> {
    List<MedecinAbsence> findByMedecin_IdAndDate(Long medecinId, LocalDate date);
    List<MedecinAbsence> findByMedecin_Id(Long medecinId);
}

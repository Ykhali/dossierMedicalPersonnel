package com.example.backend.Dao;

import com.example.backend.Entity.MedecinHoraire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

public interface MedecinHoraireRepository extends JpaRepository<MedecinHoraire, Long> {
    List<MedecinHoraire> findByMedecin_IdAndDateSpecific(Long medecinId, LocalDate date);
    List<MedecinHoraire> findByMedecin_IdAndDayOfWeek(Long medecinId, DayOfWeek dayOfWeek);
    List<MedecinHoraire> findByMedecin_IdOrderByDayOfWeekAsc(Long medecinId);
}

package com.example.backend.Dao;

import com.example.backend.Entity.MedecinWeeklyHour;
import com.example.backend.Entity.Enums.Weekday;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MedecinWeeklyHourRepository extends JpaRepository<MedecinWeeklyHour, Long> {
    List<MedecinWeeklyHour> findByMedecinId(Long medecinId);
    Optional<MedecinWeeklyHour> findByMedecinIdAndWeekday(Long medecinId, Weekday day);
    void deleteByMedecinId(Long medecinId);
}

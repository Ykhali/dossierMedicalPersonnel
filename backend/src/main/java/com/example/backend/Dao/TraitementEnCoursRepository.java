package com.example.backend.Dao;

import com.example.backend.Entity.TraitementEnCours;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TraitementEnCoursRepository extends JpaRepository<TraitementEnCours, Long> {
    List<TraitementEnCours> findByStatut(String statut);
}

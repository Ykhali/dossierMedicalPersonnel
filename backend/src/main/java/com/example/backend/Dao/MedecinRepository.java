package com.example.backend.Dao;

import com.example.backend.Entity.Medecin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    Medecin findMedecinBySexe(String sexe);
    Medecin findMedecinById(long id);
}

package com.example.backend.Dao;

import com.example.backend.Entity.HistoriqueRendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HistoriqueRendezVousRepository extends JpaRepository<HistoriqueRendezVous, Long> {
}

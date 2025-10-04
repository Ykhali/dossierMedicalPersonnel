package com.example.backend.Dao;

import com.example.backend.Entity.FactureLigne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// FactureLigneRepository.java (optional if you only cascade via Facture)
public interface FactureLigneRepository extends JpaRepository<FactureLigne, Long> {

    List<FactureLigne> findByFactureId(Long factureId);
}


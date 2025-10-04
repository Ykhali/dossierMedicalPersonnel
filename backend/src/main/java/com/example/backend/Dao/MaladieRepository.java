package com.example.backend.Dao;

import com.example.backend.Entity.Maladie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaladieRepository extends JpaRepository<Maladie, Long> {
    List<Maladie> findByPatientIdOrderByIdDesc(Long patientId);
    boolean existsByPatientIdAndLabelIgnoreCaseAndStatut(Long patientId, String label, String statut);
}

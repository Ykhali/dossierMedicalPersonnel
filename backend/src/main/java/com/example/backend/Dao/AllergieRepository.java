package com.example.backend.Dao;

import com.example.backend.Entity.Allergie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AllergieRepository extends JpaRepository<Allergie, Long> {
    List<Allergie> findByPatientIdOrderByIdDesc(Long patientId);
    boolean existsByPatientIdAndLabelIgnoreCaseAndActiveTrue(Long patientId, String label);
}

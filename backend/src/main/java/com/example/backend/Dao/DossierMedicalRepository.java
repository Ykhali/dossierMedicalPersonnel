package com.example.backend.Dao;

import com.example.backend.Entity.DossierMedical;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DossierMedicalRepository extends JpaRepository<DossierMedical, Long> {
    Optional<DossierMedical> findByPatient_Id(Long patientId);
    boolean existsByPatient_Id(Long patientId);
}

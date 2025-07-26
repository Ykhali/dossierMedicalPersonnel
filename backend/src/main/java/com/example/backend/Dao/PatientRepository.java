package com.example.backend.Dao;

import com.example.backend.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findPatientById(Long id);

    boolean existsByEmail(String email);

    Optional<Patient> findByEmail(String email);
}

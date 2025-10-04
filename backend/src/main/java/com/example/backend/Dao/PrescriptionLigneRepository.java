package com.example.backend.Dao;

import com.example.backend.Entity.FactureLigne;
import com.example.backend.Entity.PrescriptionLigne;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionLigneRepository extends JpaRepository<PrescriptionLigne, Long> {
    List<PrescriptionLigne> findByPrescriptionId(Long prescriptionId);

}

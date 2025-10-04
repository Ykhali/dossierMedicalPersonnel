package com.example.backend.Dao;

import com.example.backend.Entity.HistoriqueRendezVous;
import com.example.backend.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HistoriqueRendezVousRepository extends JpaRepository<HistoriqueRendezVous, Long> {

    //Optional<HistoriqueRendezVous> findByIdRDV(Long idRDV);
    @Query("""
           select h
           from HistoriqueRendezVous h
           where h.IdRDV = :rvId
           order by h.dateCreation desc
           """)
    List<HistoriqueRendezVous> findByRvIdOrderByDateCreationDesc(@Param("rvId") Long rvId);

    List<HistoriqueRendezVous> findByPatient(Patient p);

    void deleteByPatientId(Long id);
}

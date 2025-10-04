package com.example.backend.Dao;

import com.example.backend.Entity.Facture;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface FactureRepository extends JpaRepository<Facture, Long> {
    List<Facture> findByStatutOrderByDateEmissionDesc(String statut);
    List<Facture> findByMedecin_IdOrderByDateEmissionDesc(Long medecinId);

    List<Facture> findByDateEmission(LocalDate date);

    @Query("select f from Facture f where f.patient.cin = :cin and f.dateEmission between :start and :end")
    List<Facture> findByCinAndDateBetween(@Param("cin") String cin,
                                          @Param("start") LocalDate start,
                                          @Param("end") LocalDate end);

    @Query("select distinct year(f.dateEmission) from Facture f where f.patient.cin = :cin order by 1 desc")
    List<Integer> findYearsForCin(@Param("cin") String cin);

}

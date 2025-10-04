package com.example.backend.Dao;

import com.example.backend.Entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByDate(LocalDate date);

    @Query("select p from Prescription p where p.patient.cin = :cin and p.date between :start and :end")
    List<Prescription> findByCinAndDateBetween(@Param("cin") String cin,
                                               @Param("start") LocalDate start,
                                               @Param("end") LocalDate end);

    @Query("select distinct year(p.date) from Prescription p where p.patient.cin = :cin order by 1 desc")
    List<Integer> findYearsForCin(@Param("cin") String cin);
}

package com.example.backend.Dao;

import com.example.backend.Entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Long> {
    Patient findPatientById(Long id);

    @Query("select p.id from Patient p where p.email = :email")
    Optional<Long> findIdByEmail(@Param("email") String email);

    boolean existsByEmail(String email);


    Optional<Patient> findByEmail(String email);

    List<Patient> findByCin(String cin);
    List<Patient> findByTelephone(String telephone);
    List<Patient> findByEmailIgnoreCase(String email);

    @Query("""
    SELECT p FROM Patient p
    WHERE LOWER(p.Nom) LIKE LOWER(CONCAT('%', :q, '%'))
       OR LOWER(p.Prenom) LIKE LOWER(CONCAT('%', :q, '%'))
       OR LOWER(p.email) LIKE LOWER(CONCAT('%', :q, '%'))
       OR p.cin LIKE CONCAT('%', :q, '%')
       OR p.telephone LIKE CONCAT('%', :q, '%')
  """)
    List<Patient> searchFuzzy(@Param("q") String q);

    @Query("select p.id from Patient p where p.email = :email")
    Optional<Patient> findIdByUserEmail(@Param("email") String email);

    @Query("select p from Patient p where p.id = :id") // bypass @Where is tricky; use native if needed
    Optional<Patient> findIncludingDeleted(@Param("id") Long id);

    @Query(value = "select * from patients p join users u on u.id = p.id where p.id = :id", nativeQuery = true)
    Optional<Patient> findNativeIncludingDeleted(@Param("id") Long id);


    List<Patient> findByDeletedFalse();

    List<Patient>  findByDeletedTrue();

    @Query("""
    SELECT DISTINCT rv.patient
    FROM RendezVous rv
    JOIN rv.medecin m
    JOIN m.receptionnistes r
    WHERE r.id = :recepId
  """)
    List<Patient> findPatientsVisiblesParReceptionniste(@Param("recepId") Long recepId);


}

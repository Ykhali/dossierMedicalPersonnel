package com.example.backend.Dao;

import com.example.backend.Dto.ReceptionnisteDto;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Receptionniste;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReceptionnisteRepository extends JpaRepository<Receptionniste, Long> {
    Receptionniste findReceptionnisteById(Long id);

    List<Receptionniste> findByDeletedTrue();

    @Query("select r from Receptionniste r left join fetch r.medecins where r.id = :id")
    Optional<Receptionniste> findByIdWithMedecins(@Param("id") Long id);

    Optional<Receptionniste> findByEmail(String email);

    boolean existsByEmailAndIdNot(String email, Long id);
    boolean existsByCinAndIdNot(String cin, Long id);

    @Query("""
    select r.email
    from Receptionniste r
      join r.medecins m
    where m.id = :medecinId
      and (r.deleted = false or r.deleted is null)
  """)
    List<String> findEmailsByMedecinId(@Param("medecinId") Long medecinId);

}

package com.example.backend.Dao;

import com.example.backend.Dto.MedecinDto;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Patient;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    Medecin findMedecinBySexe(String sexe);
    Medecin findMedecinById(long id);
    Optional<Medecin> findByEmail(String email);

    @Query("""
           select m
           from Medecin m
           left join fetch m.receptionnistes r
           where m.email = :email
           """)
    Optional<Medecin> findByEmailWithReceptionnistes(@Param("email") String email);

    List<Medecin> findByDeletedTrue();

    // Chargement avec les réceptionnistes pour éviter LazyInitialization en lecture
    @Query("select m from Medecin m left join fetch m.receptionnistes where m.id = :id")
    Optional<Medecin> findByIdWithReceptionnistes(@Param("id") Long id);

    boolean existsByIdAndReceptionnistes_Email(Long id, String email);

    List<Medecin> findBySpecialiteIgnoreCase(String q);


    List<Medecin> findByNomCompletIgnoreCase(String nomComplete);




}

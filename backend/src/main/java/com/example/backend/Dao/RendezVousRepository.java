package com.example.backend.Dao;

import com.example.backend.Entity.Enums.StatusRendezVous;
import com.example.backend.Entity.Patient;
import com.example.backend.Entity.RendezVous;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface RendezVousRepository extends JpaRepository<RendezVous, Long> {
    Optional<Patient> findByPatientId(Long id);

    List<RendezVous> findByPatient(Patient patient);

    List<RendezVous> findByPatientAndStatus(Patient patient, StatusRendezVous status);

    List<RendezVous> findByStatus(StatusRendezVous status);

    List<RendezVous> findByMedecin_IdAndDateOrderByHeure(Long medecinId, LocalDate date);

    /*List<RendezVous> findByMedecin_IdAndDateAndStatusInOrderByHeure(
            Long medecinId,
            LocalDate date,
            List<StatusRendezVous> statuses
    );*/

        @Query("""
    SELECT DISTINCT r
    FROM RendezVous r
    WHERE r.medecin.id = :medecinId
      AND r.date = :today
      AND r.heure >= :nowTime
      AND r.status IN :statuses
    ORDER BY r.heure ASC
    """)
    List<RendezVous> findTodayAfterTimeForMedecin(
            @Param("medecinId") Long medecinId,
            @Param("today") LocalDate today,
            @Param("nowTime") String nowTime,
            @Param("statuses") List<StatusRendezVous> statuses
    );


    //List<RendezVous> findByDate(LocalDate today);

    @Query("""
    SELECT r FROM RendezVous r
    WHERE r.medecin.id = :medecinId
      AND (
            r.date > :today
         OR (r.date = :today AND r.heure >= :nowHHmm)
      )
      AND r.status IN :statuses
    ORDER BY r.date ASC, r.heure ASC
""")
    List<RendezVous> findUpcomingForMedecin(
            @Param("medecinId") Long medecinId,
            @Param("today") LocalDate today,
            @Param("nowHHmm") String nowHHmm,
            @Param("statuses") List<StatusRendezVous> statuses
    );


    List<RendezVous> findByDateOrderByHeure(LocalDate today);

    @Query("""
    SELECT r
    FROM RendezVous r
    WHERE r.date > :today
       OR (r.date = :today AND r.heure > :nowTimeStr)
    ORDER BY r.date ASC, r.heure ASC
""")
    List<RendezVous> findUpcomingAfterNow(LocalDate today, String nowTimeStr);

    List<RendezVous> findByMedecin_IdInAndDateOrderByHeureAsc(
            Collection<Long> medecinIds, LocalDate date);

    @Query("""
    select r from RendezVous r
    where r.medecin.id in :medIds
      and (
        r.date > :today
        or (r.date = :today and r.heure > :nowStr)
      )
    order by r.date asc, r.heure asc
  """)
    List<RendezVous> findUpcomingAfterNowStr(
            @Param("medIds") Collection<Long> medecinIds,
            @Param("today") LocalDate today,
            @Param("nowStr") String nowStr
    );

    /*
    Optional<RendezVous> findFirstByMedecin_IdInAndDateAndHeureGreaterThanEqualOrderByHeureAsc(
            List<Long> medIds, LocalDate date, String nowStr);

    Optional<RendezVous> findFirstByMedecin_IdInAndDateAfterOrderByDateAscHeureAsc(
            List<Long> medIds, LocalDate date);*/

    Optional<RendezVous> findFirstByMedecin_IdInAndDateAndHeureGreaterThanEqualAndStatusOrderByHeureAsc(
            List<Long> medIds,
            LocalDate date,
            String heure,
            StatusRendezVous status
    );

    Optional<RendezVous> findFirstByMedecin_IdInAndDateAfterAndStatusOrderByDateAscHeureAsc(
            List<Long> medIds,
            LocalDate date,
            StatusRendezVous status
    );

    List<RendezVous> findByMedecin_IdInAndDateAndStatusOrderByHeureAsc(
            List<Long> medIds,
            LocalDate date,
            StatusRendezVous status
    );


    // RDV du jour (tous statuts sauf annulé)
    long countByMedecin_IdInAndDate(List<Long> medIds, LocalDate date);

    // RDV annulés du jour
    long countByMedecin_IdInAndDateAndStatus(List<Long> medIds, LocalDate date, StatusRendezVous status);

    // RDV à venir (date > aujourd’hui OU date = aujourd’hui et heure > maintenant)
    @Query("SELECT COUNT(r) FROM RendezVous r " +
            "WHERE r.medecin.id IN :medIds " +
            "AND (r.date > :today OR (r.date = :today AND r.heure > :now)) " +
            "AND r.status <> 'ANNULE'")
    long countUpcoming(@Param("medIds") List<Long> medIds,
                       @Param("today") LocalDate today,
                       @Param("now") String now);



}

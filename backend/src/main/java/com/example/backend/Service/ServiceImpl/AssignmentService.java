/*package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.MedecinRepository;
import com.example.backend.Dao.ReceptionnisteRepository;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Receptionniste;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AssignmentService {

    private final MedecinRepository medecinRepo;
    private final ReceptionnisteRepository recepRepo;

    public AssignmentService(MedecinRepository medecinRepo, ReceptionnisteRepository recepRepo) {
        this.medecinRepo = medecinRepo;
        this.recepRepo = recepRepo;
    }

    @Transactional
    public Medecin setReceptionnistesForMedecin(Long medecinId, List<Long> receptionnisteIds) {
        Medecin m = medecinRepo.findById(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));

        // Optionnel: vérifier la même clinique ici

        Set<Receptionniste> newSet = new HashSet<>(recepRepo.findAllById(receptionnisteIds));
        m.getReceptionnistes().clear();
        m.getReceptionnistes().addAll(newSet);
        return medecinRepo.save(m);
    }

    @Transactional
    public Medecin addReceptionnistesToMedecin(Long medecinId, List<Long> receptionnisteIds) {
        Medecin m = medecinRepo.findById(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        List<Receptionniste> recs = recepRepo.findAllById(receptionnisteIds);
        m.getReceptionnistes().addAll(recs);
        return medecinRepo.save(m);
    }

    @Transactional
    public Medecin removeReceptionnisteFromMedecin(Long medecinId, Long receptionnisteId) {
        Medecin m = medecinRepo.findById(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        Receptionniste r = recepRepo.findById(receptionnisteId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));
        m.getReceptionnistes().remove(r);
        return medecinRepo.save(m);
    }

    @Transactional(readOnly = true)
    public Set<Receptionniste> getReceptionnistesOfMedecin(Long medecinId) {
        Medecin m = medecinRepo.findById(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        return m.getReceptionnistes();
    }

    // Inverse : définir/ajouter des médecins à une réceptionniste
    @Transactional
    public Receptionniste setMedecinsForReceptionniste(Long recepId, List<Long> medecinIds) {
        Receptionniste r = recepRepo.findById(recepId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));
        Set<Medecin> medSet = new HashSet<>(medecinRepo.findAllById(medecinIds));
        r.getMedecins().clear();
        r.getMedecins().addAll(medSet);
        return recepRepo.save(r);
    }
}*/

/*
package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.MedecinRepository;
import com.example.backend.Dao.ReceptionnisteRepository;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Receptionniste;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final MedecinRepository medecinRepo;
    private final ReceptionnisteRepository recepRepo;

    public AssignmentService(MedecinRepository medecinRepo, ReceptionnisteRepository recepRepo) {
        this.medecinRepo = medecinRepo;
        this.recepRepo = recepRepo;
    }

     Remplace l’ensemble des réceptionnistes d’un médecin
    @Transactional
    public Medecin setReceptionnistesForMedecin(Long medecinId, List<Long> receptionnisteIds) {
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        Set<Receptionniste> newSet = new HashSet<>(fetchAllReceptionnistesStrict(receptionnisteIds));
        m.getReceptionnistes().clear();
        m.getReceptionnistes().addAll(newSet);
        return medecinRepo.save(m);
    }

     Ajoute des réceptionnistes à un médecin (sans écraser les existants)
    @Transactional
    public Medecin addReceptionnistesToMedecin(Long medecinId, List<Long> receptionnisteIds) {
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        List<Receptionniste> toAdd = fetchAllReceptionnistesStrict(receptionnisteIds);
        m.getReceptionnistes().addAll(toAdd);
        return medecinRepo.save(m);
    }

     Retire une réceptionniste d’un médecin
    @Transactional
    public Medecin removeReceptionnisteFromMedecin(Long medecinId, Long receptionnisteId) {
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        Receptionniste r = recepRepo.findById(receptionnisteId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));
        m.getReceptionnistes().remove(r);
        return medecinRepo.save(m);
    }

    @Transactional(readOnly = true)
    public Set<Receptionniste> getReceptionnistesOfMedecin(Long medecinId) {
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        return m.getReceptionnistes();
    }


     Remplace l’ensemble des médecins d’une réceptionniste
    @Transactional
    public Receptionniste setMedecinsForReceptionniste(Long recepId, List<Long> medecinIds) {
        Receptionniste r = recepRepo.findByIdWithMedecins(recepId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));

        // 1) retirer cette réceptionniste de tous ses anciens médecins (propriétaire)
        for (Medecin old : new HashSet<>(r.getMedecins())) {
            old.getReceptionnistes().remove(r);
        }

        // 2) ajouter cette réceptionniste aux nouveaux médecins (propriétaire)
        List<Medecin> newMeds = fetchAllMedecinsStrict(medecinIds);
        for (Medecin m : newMeds) {
            m.getReceptionnistes().add(r);
        }

        // 3) cohérence côté inverse en mémoire
        r.getMedecins().clear();
        r.getMedecins().addAll(newMeds);

        // Pas besoin de save(r) ; le dirty checking sur Medecin fera la persistance
        return r;
    }

     Ajoute des médecins à une réceptionniste (sans écraser les existants)
    @Transactional
    public Receptionniste addMedecinsToReceptionniste(Long recepId, List<Long> medecinIds) {
        Receptionniste r = recepRepo.findByIdWithMedecins(recepId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));
        List<Medecin> meds = fetchAllMedecinsStrict(medecinIds);

        for (Medecin m : meds) {
            m.getReceptionnistes().add(r); // propriétaire
            r.getMedecins().add(m);        // inverse (mémoire)
        }
        return r;
    }

     Retire un médecin à une réceptionniste
    @Transactional
    public Receptionniste removeMedecinFromReceptionniste(Long recepId, Long medecinId) {
        Receptionniste r = recepRepo.findByIdWithMedecins(recepId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));

        m.getReceptionnistes().remove(r); // propriétaire
        r.getMedecins().remove(m);        // inverse (mémoire)
        return r;
    }



    private List<Receptionniste> fetchAllReceptionnistesStrict(List<Long> ids) {
        if (ids == null) return List.of();
        List<Receptionniste> list = recepRepo.findAllById(ids);
        ensureAllFound("réceptionniste", ids, list.stream().map(Receptionniste::getId).collect(Collectors.toSet()));
        return list;
    }

    private List<Medecin> fetchAllMedecinsStrict(List<Long> ids) {
        if (ids == null) return List.of();
        List<Medecin> list = medecinRepo.findAllById(ids);
        ensureAllFound("médecin", ids, list.stream().map(Medecin::getId).collect(Collectors.toSet()));
        return list;
    }

    private void ensureAllFound(String label, List<Long> requestedIds, Set<Long> foundIds) {
        Set<Long> req = new HashSet<>(requestedIds);
        req.removeAll(foundIds);
        if (!req.isEmpty()) {
            throw new IllegalArgumentException("IDs " + label + " introuvables: " + req);
        }
    }
}*/

package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.MedecinRepository;
import com.example.backend.Dao.ReceptionnisteRepository;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Receptionniste;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    private final MedecinRepository medecinRepo;
    private final ReceptionnisteRepository recepRepo;

    public AssignmentService(MedecinRepository medecinRepo, ReceptionnisteRepository recepRepo) {
        this.medecinRepo = medecinRepo;
        this.recepRepo = recepRepo;
    }

    /* =========================
       Affectations côté MÉDECIN
       (côté propriétaire ManyToMany)
       ========================= */

    /** Remplace l’ensemble des réceptionnistes d’un médecin */
    @Transactional
    public Medecin setReceptionnistesForMedecin(Long medecinId, List<Long> receptionnisteIds) {
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        Set<Receptionniste> newSet = new HashSet<>(fetchAllReceptionnistesStrict(receptionnisteIds));
        m.getReceptionnistes().clear();
        m.getReceptionnistes().addAll(newSet);
        return medecinRepo.save(m);
    }

    /** Ajoute des réceptionnistes à un médecin (sans écraser les existants) */
    @Transactional
    public Medecin addReceptionnistesToMedecin(Long medecinId, List<Long> receptionnisteIds) {
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        List<Receptionniste> toAdd = fetchAllReceptionnistesStrict(receptionnisteIds);
        m.getReceptionnistes().addAll(toAdd);
        return medecinRepo.save(m);
    }

    /** Retire une réceptionniste d’un médecin */
    @Transactional
    public Medecin removeReceptionnisteFromMedecin(Long medecinId, Long receptionnisteId) {
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        Receptionniste r = recepRepo.findById(receptionnisteId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));
        m.getReceptionnistes().remove(r);
        return medecinRepo.save(m);
    }

    @Transactional(readOnly = true)
    public Set<Receptionniste> getReceptionnistesOfMedecin(Long medecinId) {
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));
        return m.getReceptionnistes();
    }

    /* =========================
       Affectations côté RÉCEPTIONNISTE
       (on modifie la jointure via MÉDECIN, propriétaire)
       ========================= */

    /** Remplace l’ensemble des médecins d’une réceptionniste */
    @Transactional
    public Receptionniste setMedecinsForReceptionniste(Long recepId, List<Long> medecinIds) {
        Receptionniste r = recepRepo.findByIdWithMedecins(recepId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));

        // Retirer r de tous ses anciens médecins (propriétaire)
        for (Medecin old : new HashSet<>(r.getMedecins())) {
            old.getReceptionnistes().remove(r);
        }

        // Ajouter r aux nouveaux médecins (propriétaire)
        List<Medecin> newMeds = fetchAllMedecinsStrict(medecinIds);
        for (Medecin m : newMeds) {
            m.getReceptionnistes().add(r);
        }

        // Cohérence côté inverse en mémoire
        r.getMedecins().clear();
        r.getMedecins().addAll(newMeds);

        return r; // dirty checking sur Medecin
    }

    /** Ajoute des médecins à une réceptionniste (sans écraser les existants) */
    @Transactional
    public Receptionniste addMedecinsToReceptionniste(Long recepId, List<Long> medecinIds) {
        Receptionniste r = recepRepo.findByIdWithMedecins(recepId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));
        List<Medecin> meds = fetchAllMedecinsStrict(medecinIds);

        for (Medecin m : meds) {
            m.getReceptionnistes().add(r); // propriétaire
            r.getMedecins().add(m);        // inverse (mémoire)
        }
        return r;
    }

    /** Retire un médecin à une réceptionniste */
    @Transactional
    public Receptionniste removeMedecinFromReceptionniste(Long recepId, Long medecinId) {
        Receptionniste r = recepRepo.findByIdWithMedecins(recepId)
                .orElseThrow(() -> new IllegalArgumentException("Réceptionniste introuvable"));
        Medecin m = medecinRepo.findByIdWithReceptionnistes(medecinId)
                .orElseThrow(() -> new IllegalArgumentException("Médecin introuvable"));

        m.getReceptionnistes().remove(r); // propriétaire
        r.getMedecins().remove(m);        // inverse (mémoire)
        return r;
    }

    /* =========================
       Utils de validation
       ========================= */

    private List<Receptionniste> fetchAllReceptionnistesStrict(List<Long> ids) {
        if (ids == null) return List.of();
        List<Receptionniste> list = recepRepo.findAllById(ids);
        ensureAllFound("réceptionniste", ids, list.stream().map(Receptionniste::getId).collect(Collectors.toSet()));
        return list;
    }

    private List<Medecin> fetchAllMedecinsStrict(List<Long> ids) {
        if (ids == null) return List.of();
        List<Medecin> list = medecinRepo.findAllById(ids);
        ensureAllFound("médecin", ids, list.stream().map(Medecin::getId).collect(Collectors.toSet()));
        return list;
    }

    private void ensureAllFound(String label, List<Long> requestedIds, Set<Long> foundIds) {
        Set<Long> missing = new HashSet<>(requestedIds);
        missing.removeAll(foundIds);
        if (!missing.isEmpty()) {
            throw new IllegalArgumentException("IDs " + label + " introuvables: " + missing);
        }
    }
}


package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.MedecinRepository;
import com.example.backend.Dao.ReceptionnisteRepository;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Receptionniste;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AffectationService {
    private final MedecinRepository medecinRepo;
    private final ReceptionnisteRepository recepRepo;

    public AffectationService(MedecinRepository medecinRepo, ReceptionnisteRepository recepRepo) {
        this.medecinRepo = medecinRepo;
        this.recepRepo = recepRepo;
    }

    /** Ajoute des réceptionnistes à un médecin (n’écrase pas l’existant) */
    public Medecin addReceptionnistesToMedecin(Long medecinId, List<Long> recepIds) {
        Medecin m = medecinRepo.findById(medecinId)
                .orElseThrow(() -> new EntityNotFoundException("Médecin introuvable: " + medecinId));
        List<Receptionniste> receps = recepRepo.findAllById(recepIds);
        if (receps.isEmpty()) throw new EntityNotFoundException("Aucune réceptionniste trouvée");

        // MAJ uniquement côté propriétaire (Medecin) -> la table de jointure sera mise à jour
        for (Receptionniste r : receps) {
            m.getReceptionnistes().add(r);
        }
        return m;
    }

    /** Remplace complètement les réceptionnistes d’un médecin */
    public Medecin setReceptionnistesOfMedecin(Long medecinId, List<Long> recepIds) {
        Medecin m = medecinRepo.findById(medecinId)
                .orElseThrow(() -> new EntityNotFoundException("Médecin introuvable: " + medecinId));
        List<Receptionniste> receps = recepRepo.findAllById(recepIds);

        m.getReceptionnistes().clear();
        m.getReceptionnistes().addAll(receps);
        return m;
    }

    /** Désaffecter une réceptionniste d’un médecin */
    public void removeReceptionnisteFromMedecin(Long medecinId, Long recepId) {
        Medecin m = medecinRepo.findById(medecinId)
                .orElseThrow(() -> new EntityNotFoundException("Médecin introuvable: " + medecinId));
        Receptionniste r = recepRepo.findById(recepId)
                .orElseThrow(() -> new EntityNotFoundException("Réceptionniste introuvable: " + recepId));

        m.getReceptionnistes().remove(r);
    }

    /** Affecter des médecins à une réceptionniste (optionnel) : */
    public Receptionniste addMedecinsToReceptionniste(Long recepId, List<Long> medIds) {
        Receptionniste r = recepRepo.findById(recepId)
                .orElseThrow(() -> new EntityNotFoundException("Réceptionniste introuvable: " + recepId));
        List<Medecin> meds = medecinRepo.findAllById(medIds);
        // côté propriétaire = Medecin -> on ajoute R sur chaque M
        for (Medecin m : meds) {
            m.getReceptionnistes().add(r);
        }
        return r;
    }
}


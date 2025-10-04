package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.*;
import com.example.backend.Dto.*;
import com.example.backend.Entity.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static com.example.backend.config.SecurityUtils.getCurrentUserEmail;

@Service
public class DossierMedicalService {

    @Autowired private  DossierMedicalRepository dossierRepo;
    @Autowired private  PatientRepository patientRepo;
    @Autowired private  AllergieRepository allergieRepository;
    @Autowired private  MaladieRepository maladieRepository;
    @Autowired
    private SigneVitalRepository signeVitalRepository;


    /** Retourne le dossier du patient, le crée s’il n’existe pas. */
    @Transactional
    public DossierMedical getOrCreateByPatientId(Long patientId) {
        return dossierRepo.findByPatient_Id(patientId).orElseGet(() -> {
            Patient p = patientRepo.findById(patientId)
                    .orElseThrow(() -> new IllegalArgumentException("Patient introuvable: " + patientId));
            DossierMedical dm = new DossierMedical(p);
            return dossierRepo.save(dm);
        });
    }

    private Patient getPatientOrThrow(Long patientId) {
        return patientRepo.findById(patientId)
                .orElseThrow(() -> new IllegalArgumentException("Patient non trouvé"));
    }


    /* ---------- Dossier (lecture agrégée) ---------- */

    /** Retourne/Crée le dossier 1–1 si besoin (utile au moment d'ouvrir le dossier la 1ère fois) */
    @Transactional
    public DossierMedical getOrCreateDossier(Long patientId) {
        Patient p = getPatientOrThrow(patientId);
        return dossierRepo.findByPatient_Id(patientId)
                .orElseGet(() -> dossierRepo.save(new DossierMedical(p)));
    }

    /** Assemble la réponse API “dossier complet” (patient + allergies + maladies) */
    @Transactional
    public DossierMedicalResponse getDossierComplet(Long patientId) {
        Patient p = getPatientOrThrow(patientId);
        // pas d’assert ici si l’accès lecture est ouvert à d’autres rôles (ex: réceptionniste)
        var allergies = allergieRepository.findByPatientIdOrderByIdDesc(patientId).stream()
                .map(a -> new AllergieResponse(
                        a.getId(), a.getLabel(), a.getReaction(), a.getGravite(),
                        a.getNotes(), a.isActive(), a.getDateDebut()))
                .toList();

        var maladies = maladieRepository.findByPatientIdOrderByIdDesc(patientId).stream()
                .map(m -> new MaladieResponse(
                        m.getId(), m.getLabel(), m.getCode(), m.getSystemeCode(),
                        m.getStatut(), m.getNotes(), m.getDateDebut(), m.getDateFin()))
                .toList();

        return new DossierMedicalResponse(
                p.getId(), p.getNom(), p.getPrenom(), p.getEmail(), p.getTelephone(),
                allergies, maladies
        );
    }

    /* ---------- Allergies ---------- */

    @Transactional
    public Allergie addAllergie(Long patientId, CreateAllergieRequest req) {
        Patient p = getPatientOrThrow(patientId);

        if (req.label == null || req.label.isBlank()) {
            throw new IllegalArgumentException("Label d'allergie obligatoire");
        }
        // Anti-doublon simple: même label actif pour ce patient
        if (allergieRepository.existsByPatientIdAndLabelIgnoreCaseAndActiveTrue(patientId, req.label)) {
            throw new IllegalStateException("Allergie déjà active pour ce patient");
        }

        Allergie a = new Allergie();
        a.setPatient(p);
        a.setLabel(req.label.trim());
        a.setReaction(req.reaction);
        a.setGravite(req.gravite);
        a.setDateDebut(req.dateDebut);
        a.setNotes(req.notes);
        a.setActive(true);
        a.setCreatedBy(getCurrentUserEmail());
        return allergieRepository.save(a);
    }

    public List<Allergie> listAllergies(Long patientId) {
        // lecture : à toi de décider si tu veux restreindre aussi
        getPatientOrThrow(patientId);
        return allergieRepository.findByPatientIdOrderByIdDesc(patientId);
    }

    @Transactional
    public Allergie updateAllergie(Long allergieId, UpdateAllergieRequest req) {
        Allergie a = allergieRepository.findById(allergieId)
                .orElseThrow(() -> new IllegalArgumentException("Allergie non trouvée"));

        if (req.label != null && !req.label.isBlank()) a.setLabel(req.label.trim());
        if (req.reaction != null) a.setReaction(req.reaction);
        if (req.gravite != null) a.setGravite(req.gravite);
        if (req.notes != null) a.setNotes(req.notes);
        if (req.active != null) a.setActive(req.active);

        return allergieRepository.save(a);
    }

    @Transactional
    public void deleteAllergie(Long allergieId) {
        Allergie a = allergieRepository.findById(allergieId)
                .orElseThrow(() -> new IllegalArgumentException("Allergie non trouvée"));
        allergieRepository.delete(a);
    }

    /* ---------- Maladies ---------- */

    @Transactional
    public Maladie addMaladie(Long patientId, CreateMaladieRequest req) {
        Patient p = getPatientOrThrow(patientId);

        if (req.label == null || req.label.isBlank()) {
            throw new IllegalArgumentException("Label de maladie obligatoire");
        }

        Maladie m = new Maladie();
        m.setPatient(p);
        m.setLabel(req.label.trim());
        m.setCode(req.code);
        m.setSystemeCode(req.systemeCode);
        m.setDateDebut(req.dateDebut);
        m.setNotes(req.notes);
        m.setStatut("active");
        m.setCreatedBy(getCurrentUserEmail());
        return maladieRepository.save(m);
    }

    public List<Maladie> listMaladies(Long patientId) {
        getPatientOrThrow(patientId);
        return maladieRepository.findByPatientIdOrderByIdDesc(patientId);
    }

    @Transactional
    public Maladie updateMaladie(Long maladieId, UpdateMaladieRequest req) {
        Maladie m = maladieRepository.findById(maladieId)
                .orElseThrow(() -> new IllegalArgumentException("Maladie non trouvée"));

        if (req.label != null && !req.label.isBlank()) m.setLabel(req.label.trim());
        if (req.code != null) m.setCode(req.code);
        if (req.systemeCode != null) m.setSystemeCode(req.systemeCode);
        if (req.dateFin != null) m.setDateFin(req.dateFin);
        if (req.statut != null) m.setStatut(req.statut);
        if (req.notes != null) m.setNotes(req.notes);

        return maladieRepository.save(m);
    }

    @Transactional
    public void deleteMaladie(Long maladieId) {
        Maladie m = maladieRepository.findById(maladieId)
                .orElseThrow(() -> new IllegalArgumentException("Maladie non trouvée"));
        maladieRepository.delete(m);
    }

    /*-------- Signe Vitaux----------*/
    @Transactional
    public SigneVital addSigneVital(Long patientId, CreateSigneVitalRequest req) {
        Patient p = getPatientOrThrow(patientId);
        SigneVital s = new SigneVital();
        s.setPatient(p);
        s.setTemperature(req.getTemperature());
        s.setTension(req.getTension());
        s.setFrequenceRespiratoire(req.getFrequenceRespiratoire());
        s.setSaturationOxygene(req.getSaturationOxygene());
        s.setPoids(req.getPoids());
        s.setTaille(req.getTaille());
        s.setCommentaire(req.getCommentaire());

        System.out.println("=== DTO reçu ===");
        System.out.println("Temp: " + req.getTemperature());
        System.out.println("Tension: " + req.getTension());
        System.out.println("FR: " + req.getFrequenceRespiratoire());
        System.out.println("SpO2: " + req.getSaturationOxygene());
        System.out.println("Poids: " + req.getPoids());
        System.out.println("Taille: " + req.getTaille());
        System.out.println("Commentaire: " + req.getCommentaire());

        return signeVitalRepository.save(s);
    }

    @Transactional
    public SigneVital updateSigneVital(Long signeId, UpdateSigneVitalRequest req) {
        SigneVital s = signeVitalRepository.findById(signeId)
                .orElseThrow(() -> new IllegalArgumentException("Signe vital non trouvé"));
        if (req.getTemperature() != null) s.setTemperature(req.getTemperature());
        if (req.getTension() != null) s.setTension(req.getTension());
        if (req.getFrequenceRespiratoire() != null) s.setFrequenceRespiratoire(req.getFrequenceRespiratoire());
        if (req.getSaturationOxygene() != null) s.setSaturationOxygene(req.getSaturationOxygene());
        if (req.getPoids() != null) s.setPoids(req.getPoids());
        if (req.getTaille() != null) s.setTaille(req.getTaille());
        if (req.getCommentaire() != null) s.setCommentaire(req.getCommentaire());

        return signeVitalRepository.save(s);

    }

    @Transactional
    public void deleteSigneVital(Long signeVitalId) {
        SigneVital signe = signeVitalRepository.findById(signeVitalId)
                .orElseThrow(() -> new IllegalArgumentException("Signe vital non trouver"));
        signeVitalRepository.delete(signe);
    }
}
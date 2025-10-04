package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.*;
import com.example.backend.Dto.CreatePrescriptionRequest;
import com.example.backend.Entity.*;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import static com.example.backend.config.SecurityUtils.getCurrentUserEmail;

@Service
public class PrescriptionService {
    private final MedecinRepository medecinRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final PrescriptionLigneRepository prescriptionLigneRepository;
    private final PrescriptionPdfService prescriptionPdfService;
    private final TraitementEnCoursRepository traitementEnCoursRepository;

    public PrescriptionService(MedecinRepository medecinRepository,
                               PrescriptionRepository prescriptionRepository,
                               PatientRepository patientRepository,
                               PrescriptionLigneRepository prescriptionLigneRepository,
                               PrescriptionPdfService prescriptionPdfService,
                               TraitementEnCoursRepository traitementEnCoursRepository) {
        this.medecinRepository = medecinRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.prescriptionLigneRepository = prescriptionLigneRepository;
        this.prescriptionPdfService = prescriptionPdfService;
        this.traitementEnCoursRepository = traitementEnCoursRepository;
    }

    private String generateNumero() {
        return "Ordonnance-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0,6).toUpperCase();
    }
    public List<PrescriptionLigne> getLignes(Long prescriptionId) {
        return prescriptionLigneRepository.findByPrescriptionId(prescriptionId);
    }

    @Transactional
    public Prescription createForCurrentMedecin(CreatePrescriptionRequest request) {
        String email = getCurrentUserEmail();
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Médecin introuvable"));
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));
        Prescription prescription = new Prescription();
        prescription.setMedecin(medecin);
        prescription.setPatient(patient);
        prescription.setNumeroOrdonnance("Ordonnance-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        prescription.setDate(LocalDate.now());
        prescription.setDateValidite(request.getDateValidite());

        List<PrescriptionLigne> lignes = new ArrayList<>();
        List<TraitementEnCours> traitements = new ArrayList<>();
        if (request.getLignes() != null) {
            for (CreatePrescriptionRequest.LigneDto pl : request.getLignes()) {
                PrescriptionLigne Pligne = new PrescriptionLigne();
                Pligne.setPrescription(prescription);
                Pligne.setDosage(pl.getDosage());
                Pligne.setDuree(pl.getDuree());
                Pligne.setPosologie(pl.getPosologie());
                Pligne.setInstructions(pl.getInstructions());
                Pligne.setNomMedicament(pl.getNomMedicament());

                lignes.add(Pligne);

                TraitementEnCours traitement = new TraitementEnCours();
                traitement.setNomTraitement(pl.getNomMedicament());
                traitement.setDureeJour(pl.getDuree());
                traitement.setCompteur(pl.getDuree());
                traitement.setStatut("en cours");
                traitement.setPatient(patient);
                traitements.add(traitement);
            }
        }

        Prescription saved = prescriptionRepository.save(prescription);
        prescriptionLigneRepository.saveAll(lignes);
        traitementEnCoursRepository.saveAll(traitements);

        return saved;
    }
    @Transactional
    @Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
    public void updateTraitementCompteur() {
        List<TraitementEnCours> traitements = traitementEnCoursRepository.findByStatut("en cours");
        for (TraitementEnCours traitement : traitements) {
            int currentCompteur = traitement.getCompteur();
            if (currentCompteur > 0) {
                traitement.setCompteur(currentCompteur - 1);
                if (traitement.getCompteur() == 0) {
                    traitement.setStatut("terminé");
                }
            }
            traitementEnCoursRepository.save(traitement);
        }
    }
}

package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dto.FactureDto;
import com.example.backend.Entity.Facture;
import com.example.backend.Entity.FactureLigne;
import com.example.backend.Dao.FactureLigneRepository;
import com.example.backend.Dao.FactureRepository;
import com.example.backend.Dao.MedecinRepository;
import com.example.backend.Dao.PatientRepository;
import com.example.backend.Dto.CreateFactureRequest;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Patient;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import static com.example.backend.config.SecurityUtils.getCurrentUserEmail;

@Service
public class FactureService {
    private final FactureRepository factureRepository;
    private final FactureLigneRepository ligneRepository;
    private final FacturePdfService pdfService;
    private final MedecinRepository medecinRepository; // à toi de l’avoir
    private final PatientRepository patientRepository; // idem
    private final FactureLigneRepository factureLigneRepository;

    public FactureService(FactureRepository factureRepository, FactureLigneRepository ligneRepository, FacturePdfService pdfService, MedecinRepository medecinRepository, PatientRepository patientRepository, FactureLigneRepository factureLigneRepository) {
        this.factureRepository = factureRepository;
        this.ligneRepository = ligneRepository;
        this.pdfService = pdfService;
        this.medecinRepository = medecinRepository;
        this.patientRepository = patientRepository;
        this.factureLigneRepository = factureLigneRepository;
    }

    private String generateNumero() {
        return "FAC-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0,6).toUpperCase();
    }

    public List<FactureLigne> getLignes(Long factureId) {
        return ligneRepository.findByFactureId(factureId);
    }

    private BigDecimal computeTotal(List<FactureLigne> lignes) {
        return lignes.stream()
                .map(l -> l.getPrix() == null ? BigDecimal.ZERO : l.getPrix())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /*@Transactional
    public Facture createForDoctor(String doctorEmail, CreateFactureRequest req) throws Exception {
        var medecin = medecinRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Médecin introuvable: " + doctorEmail));
        var patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable: " + req.getPatientId()));

        var facture = new Facture();
        facture.setNumero(generateNumero());
        facture.setDateEmission(LocalDate.now());
        facture.setMedecin(medecin);
        facture.setPatient(patient);
        facture.setNotes(req.getNotes());
        facture.setStatut("EN_ATTENTE"); // pour réceptionniste

        // lignes
        var lignes = req.getLignes().stream().map(d -> {
            var l = new FactureLigne();
            l.setFacture(facture);
            l.setDescription(d.description);
            l.setPrix(d.prix);
            return l;
        }).toList();

        facture.setLignes(new ArrayList<>(lignes));

        // total
        BigDecimal total = computeTotal(lignes);
        facture.setMontant(total.doubleValue());

        // save
        var saved = factureRepository.save(facture);
        ligneRepository.saveAll(lignes);

        // génère le PDF (option: sauvegarder sur disque)
        pdfService.renderToFile(saved, lignes);

        return saved;
    }*/
    @Transactional
    public Facture createForCurrentDoctor( CreateFactureRequest req) {
        // 1. Récupérer le médecin connecté
        String email = getCurrentUserEmail();
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Médecin introuvable"));

        // 2. Récupérer le patient
        Patient patient = patientRepository.findById(req.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient introuvable"));

        // 3. Créer la facture
        Facture facture = new Facture();
        facture.setNumero("FAC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        facture.setMedecin(medecin);
        facture.setPatient(patient);
        facture.setDateEmission(LocalDate.now());
        facture.setNotes(req.getNotes());
        facture.setStatut("DRAFT");

        // 4. Ajouter les lignes
        BigDecimal total = BigDecimal.ZERO;
        List<FactureLigne> lignes = new ArrayList<>();

        if (req.getLignes() != null) {
            for (CreateFactureRequest.LigneDto l : req.getLignes()) {
                FactureLigne fl = new FactureLigne();
                fl.setFacture(facture);
                fl.setDescription(l.description);
                fl.setPrix(l.prix);

                lignes.add(fl);
                if (l.prix != null) {
                    total = total.add(l.prix);
                }
            }
        }

        // 5. Calcul du montant total (appliquer remise si définie)
        if (facture.getRemise() != null && facture.getRemise().compareTo(BigDecimal.ZERO) > 0) {
            total = total.subtract(facture.getRemise());
        }

        facture.setMontantTotal(total);
        facture.setLignes(lignes);

        // 6. Sauvegarde
        Facture saved = factureRepository.save(facture);
        factureLigneRepository.saveAll(lignes);

        return saved;
    }




}


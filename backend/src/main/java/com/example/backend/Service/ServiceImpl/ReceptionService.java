package com.example.backend.Service.ServiceImpl;

import com.example.backend.Entity.Facture;
import com.example.backend.Entity.Prescription;
import com.example.backend.Dto.DocDTO;
import com.example.backend.Dto.PatientFolderDTO;
import com.example.backend.Dto.YearDocsDTO;
import com.example.backend.Dao.FactureRepository;
import com.example.backend.Dao.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReceptionService {

    private final FactureRepository factureRepo;
    private final PrescriptionRepository prescriptionRepo;

    @Value("${app.public.files.base:/files}")
    private String publicFilesBase; // ex: /files → mappé vers /uploads

    public ReceptionService(FactureRepository f, PrescriptionRepository p) {
        this.factureRepo = f;
        this.prescriptionRepo = p;
    }

    // 1) dossiers du jour
    public List<PatientFolderDTO> getTodayFolders() {
        LocalDate today = LocalDate.now();
        var factures = factureRepo.findByDateEmission(today);
        var ordos    = prescriptionRepo.findByDate(today);

        // Regrouper par CIN
        Map<String, String> cinToName = new HashMap<>();
        Map<String, Long> fCount = factures.stream().collect(Collectors.groupingBy(
                f -> f.getPatient().getCin(), Collectors.counting()));
        Map<String, Long> oCount = ordos.stream().collect(Collectors.groupingBy(
                o -> o.getPatient().getCin(), Collectors.counting()));

        factures.forEach(f -> cinToName.put(f.getPatient().getCin(),
                f.getPatient().getPrenom() + " " + f.getPatient().getNom()));
        ordos.forEach(o -> cinToName.put(o.getPatient().getCin(),
                o.getPatient().getPrenom() + " " + o.getPatient().getNom()));

        return cinToName.keySet().stream()
                .sorted()
                .map(cin -> new PatientFolderDTO(
                        cin,
                        cinToName.get(cin),
                        fCount.getOrDefault(cin, 0L),
                        oCount.getOrDefault(cin, 0L)))
                .toList();
    }

    // 2) années disponibles pour un CIN (union factures + ordos)
    public List<Integer> getYearsForCin(String cin) {
        var fy = factureRepo.findYearsForCin(cin);
        var oy = prescriptionRepo.findYearsForCin(cin);
        var set = new TreeSet<Integer>(Comparator.reverseOrder());
        if (fy != null) set.addAll(fy);
        if (oy != null) set.addAll(oy);
        return new ArrayList<>(set);
    }

    // 3) docs par année
    public YearDocsDTO getDocsByYear(String cin, int year) {
        var start = LocalDate.of(year, 1, 1);
        var end   = LocalDate.of(year, 12, 31);

        var factures = factureRepo.findByCinAndDateBetween(cin, start, end);
        var ordos    = prescriptionRepo.findByCinAndDateBetween(cin, start, end);

        String nom = factures.stream().findFirst()
                .map(f -> f.getPatient().getPrenom() + " " + f.getPatient().getNom())
                .orElseGet(() -> ordos.stream().findFirst()
                        .map(o -> o.getPatient().getPrenom() + " " + o.getPatient().getNom())
                        .orElse(""));

        List<DocDTO> fDtos = factures.stream().map(f ->
                new DocDTO(f.getId(), f.getNumero(), f.getDateEmission(), toPublicUrl(f.getPdfPath()))
        ).toList();

        List<DocDTO> oDtos = ordos.stream().map(o ->
                new DocDTO(o.getId(), o.getNumeroOrdonnance(), o.getDate(), toPublicUrl(o.getPdfPath()))
        ).toList();

        return new YearDocsDTO(cin, nom, year, fDtos, oDtos);
    }

    private String toPublicUrl(String pdfPath) {
        if (pdfPath == null || pdfPath.isBlank()) return null;
        // si tu exposes /uploads sous /files/**
        // pdfPath peut être "/absolute/.../uploads/factures/xxx.pdf"
        // on retourne l’URL publique équivalente :
        int idx = pdfPath.lastIndexOf("/uploads/");
        if (idx >= 0) {
            return publicFilesBase + pdfPath.substring(idx + "/uploads".length());
        }
        // sinon, si tu stockes déjà une URL :
        return pdfPath;
    }
}

package com.example.backend.RestController;

import com.example.backend.Dao.PrescriptionRepository;
import com.example.backend.Dto.CreatePrescriptionRequest;
import com.example.backend.Entity.Prescription;
import com.example.backend.Entity.PrescriptionLigne;
import com.example.backend.Service.ServiceImpl.PrescriptionPdfService;
import com.example.backend.Service.ServiceImpl.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/ordonnances")
public class PrescriptionController {
    @Autowired
    private PrescriptionRepository prescriptionRepository;
    @Autowired
    private PrescriptionService prescriptionService;
    @Autowired
    private PrescriptionPdfService prescriptionPdfService;

    @PostMapping
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<Prescription> createPrescription(@Valid @RequestBody CreatePrescriptionRequest request) throws Exception {
        if (request.getLignes() == null){
            request.setLignes(List.of());
        }

        Prescription saved = prescriptionService.createForCurrentMedecin(request);

        List<PrescriptionLigne> lignes = prescriptionService.getLignes(saved.getId());

        String path = prescriptionPdfService.renderToFile(saved, lignes);

        saved.setPdfPath("/files/ordonnances/" + Paths.get(path).getFileName());
        prescriptionRepository.save(saved);

        return ResponseEntity.created(URI.create("/api/ordonnances/" + saved.getId())).body(saved);
    }

    // Télécharger/streamer le PDF (toujours à jour)
    /*@GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<byte[]> pdf(@PathVariable Long id) throws Exception {
        Prescription p = prescriptionRepository.findById(id).orElse(null);
        if (p == null) return ResponseEntity.notFound().build();

        byte[] bytes = prescriptionPdfService.renderToBytes(p, p.getLignes() != null ? p.getLignes() : List.of());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=facture-" + (p.getNumeroOrdonnance() != null ? p.getNumeroOrdonnance() : p.getId()) + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }*/
    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<Resource> getOrdonnancePdf(@PathVariable Long id) {
        Prescription prescription = prescriptionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ordonnance introuvable : " + id));

        String path = prescription.getPdfPath();
        File file = new File(path);

        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=" + file.getName())
                .body(resource);
    }


    // PrescriptionController.java
    @GetMapping("/{id}/getpdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<byte[]> getOrdonnancePdf(
            @PathVariable Long id,
            @RequestParam(defaultValue = "inline") String disposition) {

        Prescription p = prescriptionRepository.findById(id).orElse(null);
        Path path = Paths.get(p.getPdfPath());
        try {
            if (!Files.exists(path)) {
                byte[] regenerated = prescriptionPdfService.renderToBytes(p, p.getLignes());
                Files.createDirectories(path.getParent());
                Files.write(path, regenerated);
            }
            byte[] bytes = Files.readAllBytes(path);
            String filename = path.getFileName().toString();

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            ( "inline".equalsIgnoreCase(disposition) ? "inline" : "attachment")
                                    + "; filename=\"" + filename + "\"")
                    .body(bytes);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

}

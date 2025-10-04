package com.example.backend.RestController;

import com.example.backend.Dao.FactureRepository;
import com.example.backend.Dto.CreateFactureRequest;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.Facture;
import com.example.backend.Entity.FactureLigne;
import com.example.backend.Service.ServiceImpl.FacturePdfService;
import com.example.backend.Service.ServiceImpl.FactureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;

/*@RestController
@RequestMapping("/api/factures")
public class FactureController {

    @Autowired
    private FactureService factureService;

    @Autowired
    private FactureRepository factureRepository;

    @PostMapping
    public ResponseEntity<Facture> createFacture(@RequestBody Facture facture) {
        Facture saved = factureService.saveFacture(facture);
        return ResponseEntity.ok(saved);
    }

    @GetMapping
    public List<Facture> getAllFactures() {
        return factureRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Facture> getFactureById(@PathVariable Long id) {
        return factureRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/pdf")
    public ResponseEntity<byte[]> getFacturePdf(@PathVariable Long id) throws Exception {
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture non trouvée"));

        byte[] pdf = facturePdfService.generatePdf(facture);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=facture-" + facture.getNumero() + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }

}*/


/*
import com.example.backend.Dto.CreateFactureRequest;
import com.example.backend.Entity.Facture;
import com.example.backend.Dao.FactureRepository;
import com.example.backend.Service.ServiceImpl.FacturePdfService;
import com.example.backend.Service.ServiceImpl.FactureService;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService factureService;
    private final FactureRepository factureRepository;
    private final FacturePdfService pdfService;

    public FactureController(FactureService fs, FactureRepository fr, FacturePdfService ps) {
        this.factureService = fs;
        this.factureRepository = fr;
        this.pdfService = ps;
    }


    @PostMapping
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<Facture> create(@Valid @RequestBody CreateFactureRequest req,
                                          Principal principal) throws Exception {
        final String doctorEmail = principal.getName(); // SecurityContext / JWT -> email
        // Sécurise: si lignes null => traite comme liste vide (évite NPE côté service plus tard)
        if (req.getLignes() == null) {
            req.setLignes(List.of());
        }
        Facture saved = factureService.createForDoctor(doctorEmail, req);
        // 201 + Location: /api/factures/{id}
        return ResponseEntity
                .created(URI.create("/api/factures/" + saved.getId()))
                .body(saved);
    }


    @GetMapping("/en-attente")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public List<Facture> enAttente() {
        return factureRepository.findByStatutOrderByDateEmissionDesc("EN_ATTENTE");
    }


    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<Facture> setStatut(@PathVariable Long id,
                                             @RequestParam("value") String value) {
        // Option: whiteliste des statuts autorisés
        final Set<String> allowed = Set.of("DRAFT", "EN_ATTENTE", "IMPRIMEE", "REMIS", "ISSUED", "PAID", "CANCELED");
        if (!allowed.contains(value)) {
            return ResponseEntity.badRequest().build();
        }

        return factureRepository.findById(id)
                .map(f -> {
                    f.setStatut(value);
                    return ResponseEntity.ok(factureRepository.save(f));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }


    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<byte[]> pdf(@PathVariable Long id) throws Exception {
        Facture f = factureRepository.findById(id).orElse(null);
        if (f == null) return ResponseEntity.notFound().build();

        // Si f.getLignes() est LAZY et tu n'as pas OpenEntityManagerInView, tu peux
        // changer le service pdf pour qu'il recharge les lignes par ID si besoin.
        byte[] bytes = pdfService.renderToBytes(f, f.getLignes() != null ? f.getLignes() : List.of());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=facture-" + (f.getNumero() != null ? f.getNumero() : f.getId()) + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<Facture> getById(@PathVariable Long id) {
        return factureRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}*/


/*
import jakarta.validation.Valid;
import java.net.URI;
import java.util.Set;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService factureService;
    private final FactureRepository factureRepository;
    private final FacturePdfService pdfService;

    public FactureController(FactureService fs, FactureRepository fr, FacturePdfService ps) {
        this.factureService = fs;
        this.factureRepository = fr;
        this.pdfService = ps;
    }

    @PostMapping
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<Facture> create(
                                          @Valid @RequestBody CreateFactureRequest req) throws Exception {
        if (req.getLignes() == null) req.setLignes(List.of()); // évite NPE si null
        Facture saved = factureService.createForDoctor( req);
        return ResponseEntity.created(URI.create("/api/factures/" + saved.getId())).body(saved);
    }

    @GetMapping("/en-attente")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public List<Facture> enAttente() {
        return factureRepository.findByStatutOrderByDateEmissionDesc("EN_ATTENTE");
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<Facture> setStatut(@PathVariable Long id, @RequestParam("value") String value) {
        final Set<String> allowed = Set.of("DRAFT","EN_ATTENTE","IMPRIMEE","REMIS","ISSUED","PAID","CANCELED");
        if (!allowed.contains(value)) return ResponseEntity.badRequest().build();

        return factureRepository.findById(id)
                .map(f -> {
                    f.setStatut(value);
                    return ResponseEntity.ok(factureRepository.save(f));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<byte[]> pdf(@PathVariable Long id) throws Exception {
        Facture f = factureRepository.findById(id).orElse(null);
        if (f == null) return ResponseEntity.notFound().build();

        byte[] bytes = pdfService.renderToBytes(f, f.getLignes() != null ? f.getLignes() : List.of());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=facture-" + (f.getNumero() != null ? f.getNumero() : f.getId()) + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }
}*/
import jakarta.validation.Valid;

import java.net.URI;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/factures")
public class FactureController {

    private final FactureService factureService;
    private final FactureRepository factureRepository;
    private final FacturePdfService pdfService;
    @Value("${app.upload.dir}")
    private String uploadDir;

    public FactureController(FactureService fs, FactureRepository fr, FacturePdfService ps) {
        this.factureService = fs;
        this.factureRepository = fr;
        this.pdfService = ps;
    }

    // Médecin crée la facture (depuis son compte connecté)
    /*@PostMapping
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<Facture> create(@Valid @RequestBody CreateFactureRequest req) throws Exception {
        if (req.getLignes() == null) {
            req.setLignes(List.of()); // évite NPE si null
        }
        // Le service récupère l'email du médecin via SecurityContextHolder
        Facture saved = factureService.createForCurrentDoctor(req);
        return ResponseEntity
                .created(URI.create("/api/factures/" + saved.getId()))
                .body(saved);
    }*/
    /*@PostMapping
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<Facture> create(@Valid @RequestBody CreateFactureRequest req) throws Exception {
        if (req.getLignes() == null) {
            req.setLignes(List.of()); // évite NPE si null
        }

        // 1) Création et sauvegarde en base
        Facture saved = factureService.createForCurrentDoctor(req);

        // 2) Récupération des lignes (si pas déjà incluses dans "saved")
        List<FactureLigne> lignes = factureService.getLignes(saved.getId());

        // 3) Génération + sauvegarde physique du PDF
        String path = pdfService.renderToFileDirect(saved, lignes);

        // 4) (optionnel) stocker le chemin relatif dans la facture
        saved.setPdfPath("/files/factures/" + Paths.get(path).getFileName());
        factureRepository.save(saved); // ou factureRepository.save(saved);

        return ResponseEntity
                .created(URI.create("/api/factures/" + saved.getId()))
                .body(saved);
    }*/
    @PostMapping
    @PreAuthorize("hasRole('MEDECIN')")
    public ResponseEntity<Facture> create(@Valid @RequestBody CreateFactureRequest req) throws Exception {
        if (req.getLignes() == null) {
            req.setLignes(List.of()); // évite NPE si null
        }

        // 1) Création et sauvegarde en base
        Facture saved = factureService.createForCurrentDoctor(req);

        // 2) Récupération des lignes
        List<FactureLigne> lignes = factureService.getLignes(saved.getId());

        // 3) Génération + sauvegarde physique du PDF (une seule fois)
        String path = String.valueOf(pdfService.renderToFileDirect(saved, lignes));

        // 4) Stocker le chemin relatif dans la facture
        //saved.setPdfPath("/files/factures/" + Paths.get(path).getFileName());
        saved.setPdfPath("/files/factures/" + Paths.get(path).getFileName().toString());
        factureRepository.save(saved);

        return ResponseEntity
                .created(URI.create("/api/factures/" + saved.getId()))
                .body(saved);
    }



    // Réceptionniste : voir les factures "EN_ATTENTE"
    @GetMapping("/en-attente")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public List<Facture> enAttente() {
        return factureRepository.findByStatutOrderByDateEmissionDesc("EN_ATTENTE");
    }

    // Marquer le statut : DRAFT | EN_ATTENTE | IMPRIMEE | REMIS | ISSUED | PAID | CANCELED
    @PutMapping("/{id}/statut")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<Facture> setStatut(@PathVariable Long id, @RequestParam("value") String value) {
        final Set<String> allowed = Set.of("DRAFT","EN_ATTENTE","IMPRIMEE","REMIS","ISSUED","PAID","CANCELED");
        if (!allowed.contains(value)) return ResponseEntity.badRequest().build();

        return factureRepository.findById(id)
                .map(f -> {
                    f.setStatut(value);
                    return ResponseEntity.ok(factureRepository.save(f));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Télécharger/streamer le PDF (toujours à jour)
    /*@GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<byte[]> pdf(@PathVariable Long id) throws Exception {
        Facture f = factureRepository.findById(id).orElse(null);
        if (f == null) return ResponseEntity.notFound().build();

        byte[] bytes = pdfService.renderToBytes(f, f.getLignes() != null ? f.getLignes() : List.of());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=facture-" + (f.getNumero() != null ? f.getNumero() : f.getId()) + ".pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(bytes);
    }*/

    /*@GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<Resource> getFacturePdf(@PathVariable Long id) {
        // Ici tu récupères l’entité Facture pour connaître le chemin du fichier
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable : " + id));

        String path = facture.getPdfPath(); // ex: "uploads/factures/46.pdf"
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
    }*/
    /*@GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<Resource> getFacturePdf(@PathVariable Long id) {
        // Ici tu récupères l’entité Facture pour connaître le chemin du fichier
        Facture facture = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable : " + id));

        String path = facture.getPdfPath(); // ex: "uploads/factures/46.pdf"
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
    }*/

    @GetMapping("/{id}/pdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<Resource> getPdf(@PathVariable Long id) throws IOException {
        Facture f = factureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Facture introuvable : " + id));


        Path pdfPath = Paths.get(uploadDir).resolve("factures").resolve("facture-" + f.getId() + ".pdf");

        if (!Files.exists(pdfPath)) {
            // Générer le PDF directement dans le fichier (pas en mémoire)
            pdfService.renderToFileDirect(f, f.getLignes()); // version qui écrit sur disque
        }

        Resource fileResource = new FileSystemResource(pdfPath.toFile());

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + pdfPath.getFileName())
                .body(fileResource);
    }




    // FactureController.java
    @GetMapping("/{id}/getpdf")
    @PreAuthorize("hasAnyRole('MEDECIN','RECEPTIONNISTE')")
    public ResponseEntity<byte[]> getFacturePdf(
            @PathVariable Long id,
            @RequestParam(defaultValue = "inline") String disposition) {

        Facture f = factureRepository.findById(id).orElse(null);               // récupère en BD
        Path p = Paths.get(f.getPdfPath());                           // chemin enregistré
        try {
            if (!Files.exists(p)) {                                    // optionnel: régénérer si manquant
                byte[] regenerated = pdfService.renderToBytes(f, f.getLignes());
                Files.createDirectories(p.getParent());
                Files.write(p, regenerated);
            }
            byte[] bytes = Files.readAllBytes(p);
            String filename = p.getFileName().toString();

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


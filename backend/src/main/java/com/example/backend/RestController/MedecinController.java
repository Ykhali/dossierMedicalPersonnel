package com.example.backend.RestController;

import com.example.backend.Dao.*;
import com.example.backend.Dto.*;
import com.example.backend.Entity.*;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.Enums.StatusRendezVous;
import com.example.backend.Service.ServiceImpl.*;
import com.example.backend.mapper.MedecinDTOMapper;
import com.example.backend.mapper.ReceptionnisteDTOMapper;
import com.example.backend.mapper.RendezVousDtoMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.nio.file.*;
import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.example.backend.config.SecurityUtils.getCurrentUserEmail;

@RestController
@RequestMapping("/api/Medecin")
public class MedecinController {

    @Autowired private PrescriptionRepository prescriptionRepository;
    @Autowired private MedecinRepository medecinRepository;
    @Autowired private MedecinDTOMapper medecinDTOMapper;
    @Autowired private RendezVousRepository rendezVousRepository;
    @Autowired private RendezVousDtoMapper rendezVousDtoMapper;
    @Autowired private PatientRepository patientRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private DossierMedicalService dossierMedicalService;
    @Autowired private MedecinHoraireRepository MedecinHoraireRepository;
    @Autowired private MedecinAbsenceRepository MedecinAbsenceRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private ReceptionnisteDTOMapper receptionnisteDTOMapper;
    @Autowired private ReceptionnisteRepository receptionnisteRepository;
    private static final DateTimeFormatter HHMM = DateTimeFormatter.ofPattern("HH:mm");

    @Autowired private PatientSearchService searchService;
    @Autowired private FactureService factureService;
    @Autowired private FactureRepository factureRepository;
    @Autowired private FacturePdfService facturePdfService;

    @Value("${app.upload.dir}")
    private String uploadDir;
    @Autowired
    private PrescriptionService prescriptionService;

    private Medecin requireCurrentMedecin() {
        String email = getCurrentUserEmail(); // subject du JWT (email)
        if (email == null || email.isBlank()) {
            throw new RuntimeException("Utilisateur non authentifié.");
        }
        return medecinRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Médecin introuvable pour l'email: " + email));
    }

    // Accept-only safe folder names
    private static final Pattern SAFE_CIN = Pattern.compile("^[A-Za-z0-9_-]{1,64}$");

    // Move a directory recursively (merging if target exists); no-ops if source missing
    private void moveDir(Path source, Path target) throws IOException {
        if (!Files.exists(source)) return;

        if (!Files.exists(target)) {
            try {
                Files.createDirectories(target.getParent());
                Files.move(source, target, StandardCopyOption.ATOMIC_MOVE);
                return;
            } catch (AtomicMoveNotSupportedException | FileAlreadyExistsException ignore) {
                // fall back to recursive merge
            }
        }

        Files.walk(source).forEach(p -> {
            try {
                Path rel = source.relativize(p);
                Path dest = target.resolve(rel);
                if (Files.isDirectory(p)) {
                    Files.createDirectories(dest);
                } else {
                    Files.createDirectories(dest.getParent());
                    Files.move(p, dest, StandardCopyOption.REPLACE_EXISTING);
                }
            } catch (IOException ex) { throw new RuntimeException(ex); }
        });

        try (var stream = Files.walk(source).sorted(Comparator.reverseOrder())) {
            stream.forEach(path -> { try { Files.deleteIfExists(path); } catch (IOException ignore) {} });
        }
    }

    private void deleteTree(Path dir) throws IOException {
        if (!Files.exists(dir)) return;
        try (var s = Files.walk(dir).sorted(Comparator.reverseOrder())) {
            s.forEach(p -> { try { Files.deleteIfExists(p); } catch (IOException e) { throw new RuntimeException(e); } });
        }
    }

    /** Move ONLY image folders (profile, logo, signature) from old CIN to new CIN and fix only image URLs. */
    private void moveImagesForCinChange(Medecin med, String newCin) throws IOException {
        String oldCin = med.getCin();
        if (Objects.equals(oldCin, newCin)) return;
        if (newCin == null || newCin.isBlank() || !SAFE_CIN.matcher(newCin).matches()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CIN invalide.");
        }

        Path root = Paths.get(uploadDir).normalize();
        Path oldBase = root.resolve("medecins").resolve(Objects.toString(oldCin, "null")).normalize();
        Path newBase = root.resolve("medecins").resolve(newCin).normalize();

        // Guard: keep inside /uploadDir
        if (!oldBase.startsWith(root) || !newBase.startsWith(root)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chemin upload invalide.");
        }

        // 1) Move ONLY the image subfolders
        for (String sub : new String[]{"profile", "logo", "signature"}) {
            moveDir(oldBase.resolve(sub), newBase.resolve(sub));
        }

        // 2) Update ONLY image-related paths in DB
        String oldPrefix = "/files/medecins/" + Objects.toString(oldCin, "null") + "/";
        String newPrefix = "/files/medecins/" + newCin + "/";

        if (med.getImage() != null)       med.setImage(med.getImage().replace(oldPrefix, newPrefix));
        if (med.getLogoUrl() != null)     med.setLogoUrl(med.getLogoUrl().replace(oldPrefix, newPrefix));
        if (med.getSignatureUrl() != null) med.setSignatureUrl(med.getSignatureUrl().replace(oldPrefix, newPrefix));

        // 3) Update CIN last, after successful moves/rewrites
        med.setCin(newCin);

        // 4) Delete the OLD CIN folder (e.g., uploads/medecins/BK89633)
        try { deleteTree(oldBase); } catch (Exception ignore) { /* non-blocking */ }
    }



    @GetMapping
    public Iterable<MedecinDto> getAllMedecins() {
        return medecinRepository.findAll().stream()
                .map(medecinDTOMapper::toDto).toList();
    }

    @GetMapping("/basic-info")
    public ResponseEntity<MedecinBasicInfo> getMedecinBasicInfo() {
        String email = getCurrentUserEmail();
        Medecin medecin= medecinRepository.findByEmail(email)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médecin introuvable pour l'email: " + email));
        MedecinBasicInfo medecinBasicInfo = new MedecinBasicInfo(
                medecin.getNom(),
                medecin.getPrenom(),
                medecin.getSpecialite()
        );
        return ResponseEntity.ok(medecinBasicInfo);
    }

    @GetMapping("/perso-info")
    @Transactional(readOnly = true)
    public ResponseEntity<MedecinInfoDto> getMedecinInfo() {
        String email = getCurrentUserEmail();
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Médecin introuvable pour l'email: " + email));
        MedecinInfoDto dto = new MedecinInfoDto();
        dto.setCin(medecin.getCin());
        dto.setNom(medecin.getNom());
        dto.setPrenom(medecin.getPrenom());
        dto.setTelephone(medecin.getTelephone());
        dto.setEmail(medecin.getEmail());
        dto.setDatedenaissance(medecin.getDatedenaissance());
        dto.setAdresse(medecin.getAdresse());
        dto.setVille(medecin.getVille());
        dto.setSpecialite(medecin.getSpecialite());
        dto.setSousSpecialites(medecin.getSousSpecialites());
        dto.setLangues(medecin.getLangues());
        dto.setBio(medecin.getBio());
        dto.setPrixConsult(medecin.getPrixConsult());
        dto.setPrixTeleconsult(medecin.getPrixTeleconsult());
        dto.setSexe(medecin.getSexe());
        dto.setAcceptTeleconsult(medecin.getAcceptTeleconsult());

        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/update-infos")
    @Transactional
    public ResponseEntity<?> updateInfos(
            @Valid @RequestBody UpdateMedecinInfosRequest request
    ){
        String email = getCurrentUserEmail();
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Medecin non trouvable"));

        // ✅ Only move image folders & update image URLs if CIN changes
        if (request.getCin() != null && !Objects.equals(request.getCin(), medecin.getCin())) {
            try {
                moveImagesForCinChange(medecin, request.getCin());
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                        "Erreur lors du renommage des dossiers d’images.", e);
            }
        }

        //if (request.getCin() != null) medecin.setCin(request.getCin());
        if (request.getNom() != null) medecin.setNom(request.getNom());
        if (request.getPrenom() != null) medecin.setPrenom(request.getPrenom());
        if (request.getTelephone() != null) medecin.setTelephone(request.getTelephone());
        if (request.getEmail() != null) medecin.setEmail(request.getEmail());
        medecin.setNomComplet(request.getPrenom() + " " + request.getNom());
        if (request.getDatedenaissance() != null) medecin.setDatedenaissance(request.getDatedenaissance());
        if (request.getAdresse() != null) medecin.setAdresse(request.getAdresse());
        if (request.getVille() != null) medecin.setVille(request.getVille());
        if (request.getSpecialite() != null) medecin.setSpecialite(request.getSpecialite());
        if (request.getSousSpecialites() != null) medecin.setSousSpecialites(request.getSousSpecialites());
        if (request.getLangues() != null) medecin.setLangues(request.getLangues());
        if (request.getBio() != null) medecin.setBio(request.getBio());
        if (request.getPrixConsult() != null) medecin.setPrixConsult(request.getPrixConsult());
        if (request.getPrixTeleconsult() != null) medecin.setPrixTeleconsult(request.getPrixTeleconsult());
        if (request.getSexe() != null) medecin.setSexe(request.getSexe());
        if (request.getAcceptTeleconsult() != null) medecin.setAcceptTeleconsult(request.getAcceptTeleconsult());
        medecinRepository.save(medecin);
        return ResponseEntity.ok(medecin);
    }

    @GetMapping("/rendezVous/aujourdhui")
    public List<RendezVousDto> getRendezVousAujourdhui() {
        //Le medecin Courant
        String email = getCurrentUserEmail();
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Médecin introuvable"));
        // 2. Date du jour
        LocalDate today = LocalDate.now();
        String nowStr = LocalTime.now()
                .withSecond(0).withNano(0) // arrondi à la minute
                .format(DateTimeFormatter.ofPattern("HH:mm"));

        // 3. statuses ciblés
        List<StatusRendezVous> statuses = Arrays.asList(
                StatusRendezVous.En_attente,
                StatusRendezVous.Planifié
        );
        // 4. requête
        // 4. Requête
        return rendezVousRepository
                .findTodayAfterTimeForMedecin(medecin.getId(), today, nowStr, statuses)
                .stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();
    }

    /*@GetMapping("/rendezVous/avenir")
    public List<RendezVousDto> getAvenir() {
        String email = getCurrentUserEmail();
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Médecin introuvable"));
        LocalDate today = LocalDate.now();
        String nowTimeStr = java.time.LocalTime.now()
                .toString()              // "HH:mm:ss.nnn"
                .substring(0,5);         // "HH:mm"
        return rendezVousRepository.findUpcomingAfterNow(today, nowTimeStr)
                .stream().map(rendezVousDtoMapper::toDto).toList();
    }*/
    @GetMapping("/rendezVous/avenir")
    public List<RendezVousDto> getAvenir() {
        Medecin me = requireCurrentMedecin(); // utilise ton helper déjà présent

        LocalDate today = LocalDate.now();
        String nowStr = LocalTime.now()
                .withSecond(0).withNano(0)
                .format(DateTimeFormatter.ofPattern("HH:mm")); // évite substring fragile

        // On garde seulement les RDV réellement à venir
        List<StatusRendezVous> statuses = List.of(
                StatusRendezVous.En_attente,
                StatusRendezVous.Planifié
        );

        return rendezVousRepository
                .findUpcomingForMedecin(me.getId(), today, nowStr, statuses)
                .stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();
    }


    @PatchMapping("/rendezVous/{id}/changerStatus")
    public ResponseEntity<RendezVousDto> changerStatus(
            @PathVariable Long id,
            @Valid @RequestBody ChangeStatusRequest request) {

        RendezVous rv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "RendezVous introuvable"));

        rv.setStatus(request.getNewStatus());
        rv = rendezVousRepository.save(rv);

        RendezVousDto dto = rendezVousDtoMapper.toDto(rv);
        return ResponseEntity.ok(dto);
    }

    /*@PostMapping("/Prescription")
    public ResponseEntity<PrescriptionDto> createPrescription(
            @Valid @RequestBody PrescriptionDto prescriptionDto,
            UriComponentsBuilder uriBuilder) {

        Prescription prescription = new Prescription();
        prescription.setMedicaments(prescriptionDto.getMedicaments());
        prescription.setDate(prescriptionDto.getDate());

        Prescription savedPrescription = prescriptionRepository.save(prescription);

        PrescriptionDto savedPrescriptionDto = new PrescriptionDto(
                savedPrescription.getId(),
                savedPrescription.getMedicaments(),
                savedPrescription.getDate()
        );

        URI location = uriBuilder.path("/Prescription/{id}").buildAndExpand(savedPrescription.getId()).toUri();

        return ResponseEntity.created(location).body(savedPrescriptionDto);
    }*/
    //Create prescription
    //create facture

    // Liste toutes les règles d’horaires du médecin connecté
    @GetMapping("/horaires")
    public List<MedecinHoraire> listHoraires() {
        Medecin me = requireCurrentMedecin();
        // Si tu préfères, crée un repo method findByMedecin_Id(Long id)
        return MedecinHoraireRepository.findAll().stream()
                .filter(h -> h.getMedecin().getId().equals(me.getId()))
                .toList();
    }

    // Créer une règle d’horaire (hebdo ou spécifique)
    @PostMapping("/horaires")
    public ResponseEntity<?> createHoraire(@RequestBody HoraireRequest body) {
        Medecin me = requireCurrentMedecin();

        if (body == null) return ResponseEntity.badRequest().body("Body requis.");
        if (body.dateSpecific() == null && body.dayOfWeek() == null)
            return ResponseEntity.badRequest().body("Fournir 'dateSpecific' OU 'dayOfWeek'.");
        if (body.start() == null || body.end() == null)
            return ResponseEntity.badRequest().body("'start' et 'end' requis (HH:mm).");

        LocalTime start = LocalTime.parse(body.start());
        LocalTime end   = LocalTime.parse(body.end());
        if (!start.isBefore(end))
            return ResponseEntity.badRequest().body("'start' doit être avant 'end'.");

        MedecinHoraire h = new MedecinHoraire();
        h.setMedecin(me);
        h.setDateSpecific(body.dateSpecific());
        h.setDayOfWeek(body.dayOfWeek());
        h.setHeureDebut(start);
        h.setHeureFin(end);

        return ResponseEntity.ok(MedecinHoraireRepository.save(h));
    }

    // Supprimer une règle d’horaire (appartenant au médecin connecté)
    @DeleteMapping("/horaires/{id}")
    public ResponseEntity<?> deleteHoraire(@PathVariable Long id) {
        Medecin me = requireCurrentMedecin();
        Optional<MedecinHoraire> hOpt = MedecinHoraireRepository.findById(id);
        if (hOpt.isEmpty() || !hOpt.get().getMedecin().getId().equals(me.getId()))
            return ResponseEntity.status(404).body("Horaire introuvable pour ce médecin.");

        MedecinHoraireRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // -------------------------
    // ABSENCES – médecin connecté
    // -------------------------

    // Créer une absence (journée entière si start/end null, sinon partielle)
    @PostMapping("/absences")
    public ResponseEntity<?> createAbsence(@RequestBody Map<String, String> body) {
        Medecin me = requireCurrentMedecin();

        if (body == null || body.get("date") == null)
            return ResponseEntity.badRequest().body("'date' (YYYY-MM-DD) requis.");

        LocalDate date = LocalDate.parse(body.get("date"));
        LocalTime start = body.get("start") != null ? LocalTime.parse(body.get("start")) : null;
        LocalTime end   = body.get("end")   != null ? LocalTime.parse(body.get("end"))   : null;

        if (start != null && end != null && !start.isBefore(end))
            return ResponseEntity.badRequest().body("'start' doit être avant 'end'.");

        MedecinAbsence a = new MedecinAbsence();
        a.setMedecin(me);
        a.setDate(date);
        a.setStartTime(start);
        a.setEndTime(end);

        return ResponseEntity.ok(MedecinAbsenceRepository.save(a));
    }

    @GetMapping("/absences")
    public List<MedecinAbsence> listAbsences() {
        Medecin me = requireCurrentMedecin();
        return MedecinAbsenceRepository.findAll().stream()
                .filter(a -> a.getMedecin().getId().equals(me.getId()))
                .toList();
    }

    @DeleteMapping("/absences/{id}")
    public ResponseEntity<?> deleteAbsence(@PathVariable Long id) {
        Medecin me = requireCurrentMedecin();
        Optional<MedecinAbsence> aOpt = MedecinAbsenceRepository.findById(id);
        if (aOpt.isEmpty() || !aOpt.get().getMedecin().getId().equals(me.getId()))
            return ResponseEntity.status(404).body("Absence introuvable pour ce médecin.");

        MedecinAbsenceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // -------------------------
    // DISPONIBILITÉS – médecin connecté
    // (utile pour qu’il voie ses créneaux libres lui-même)
    // -------------------------

    // GET /api/Medecin/availability?date=2025-09-01&slot=30
    @GetMapping("/availability")
    public AvailabilityResponse getMyAvailability(
            @RequestParam String date,
            @RequestParam(required = false, defaultValue = "30") int slot
    ) {
        Medecin me = requireCurrentMedecin();
        LocalDate d = LocalDate.parse(date);

        // 1) Règles : priorité à la date spécifique, sinon hebdo
        List<MedecinHoraire> base = MedecinHoraireRepository.findByMedecin_IdAndDateSpecific(me.getId(), d);
        if (base.isEmpty()) {
            base = MedecinHoraireRepository.findByMedecin_IdAndDayOfWeek(me.getId(), d.getDayOfWeek());
        }
        if (base.isEmpty()) {
            return new AvailabilityResponse(d.toString(), me.getId(), slot, List.of());
        }

        // 2) Générer les slots
        if (slot < 5 || slot > 180 || (slot % 5 != 0)) slot = 30;
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {
            LocalTime t = h.getHeureDebut();
            while (!t.plusMinutes(slot).isAfter(h.getHeureFin())) {
                candidates.add(t);
                t = t.plusMinutes(slot);
            }
        }

        // 3) Enlever absences du jour
        List<MedecinAbsence> absences = MedecinAbsenceRepository.findByMedecin_IdAndDate(me.getId(), d);
        if (!absences.isEmpty()) {
            candidates = candidates.stream().filter(t -> {
                for (MedecinAbsence a : absences) {
                    LocalTime s = (a.getStartTime() != null) ? a.getStartTime() : LocalTime.MIN;
                    LocalTime e = (a.getEndTime()   != null) ? a.getEndTime()   : LocalTime.MAX;
                    if (!t.isBefore(s) && t.isBefore(e)) return false;
                }
                return true;
            }).collect(Collectors.toList());
        }

        // 4) (Optionnel) Ici, tu peux aussi soustraire les RDV déjà pris si tu veux,
        //    mais comme ce contrôleur n’injecte pas RendezVousRepository, on ne le fait pas.
        //    Le contrôle "slot libre" doit de toute façon être fait côté endpoint de création de RDV.

        List<String> free = candidates.stream()
                .map(HHMM::format)
                .sorted()
                .toList();

        return new AvailabilityResponse(d.toString(), me.getId(), slot, free);
    }

    @GetMapping("/patients/{id}/dossier")
    public ResponseEntity<DossierMedicalSimpleDto> getDossier(@PathVariable Long id) {
        DossierMedical dm = dossierMedicalService.getOrCreateByPatientId(id);
        var p = dm.getPatient();
        var dto = new DossierMedicalSimpleDto(
                p.getId(),
                p.getNom(), p.getPrenom(), p.getCin(),
                p.getDatedenaissance() != null ? p.getDatedenaissance().toString() : null,
                p.getTelephone(), p.getEmail(), p.getImage(), // adapte champs -> photoUrl
                dm.getAllergies(), dm.getMaladies(), dm.getSignesVitaux(), dm.getTraitementEnCours()
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/patients/search")
    public List<PatientSearchResultDto> search(@RequestParam String q){
        return searchService.search(q);
    }

    @GetMapping("/patients/{patientId}/image")
    public ResponseEntity<Resource> getPatientPhoto(
            @PathVariable Long patientId,
            Authentication auth,
            @Value("${app.upload.dir}") String uploadDir
    ) throws Exception {
        if (auth == null) return ResponseEntity.status(401).build();

        var p = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé"));

        if (p.getImage() == null) {
            return ResponseEntity.notFound().build(); // où renvoyer une image par défaut
        }

        String relative = p.getImage().replaceFirst("^/files/", ""); // ex: "/files/profile/a.jpg" -> "profile/a.jpg"
        Path file = java.nio.file.Paths.get(uploadDir).resolve(relative).normalize();

        if (!java.nio.file.Files.exists(file)) return ResponseEntity.notFound().build();


        var res = new UrlResource(file.toUri());
        String ct = java.nio.file.Files.probeContentType(file); //content type (image type)

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(ct != null ? ct : "application/octet-stream"))
                .body(res);
    }

    @GetMapping("/patients/{id}/dossierMedical")
    public DossierMedicalResponse get(@PathVariable Long id) {
        return dossierMedicalService.getDossierComplet(id);
    }

    @PostMapping("/patients/{id}/allergies")
    public AllergieResponse addAllergie(
            @PathVariable Long id,
            @RequestBody @Valid CreateAllergieRequest request) {
        var allergie = dossierMedicalService.addAllergie(id, request);
        return new AllergieResponse(allergie.getId(),
                allergie.getLabel(),
                allergie.getReaction(),
                allergie.getGravite(),
                allergie.getNotes(),
                allergie.isActive(),
                allergie.getDateDebut());
    }

    // Allergie - UPDATE
    @PatchMapping("/patients/allergies/{allergieId}")
    public AllergieResponse updateAllergie(@PathVariable Long allergieId,
                                           @RequestBody UpdateAllergieRequest req) {
        var a = dossierMedicalService.updateAllergie(allergieId, req);
        return new AllergieResponse(a.getId(), a.getLabel(), a.getReaction(), a.getGravite(),
                a.getNotes(), a.isActive(), a.getDateDebut());
    }

    // Allergie - DELETE
    @DeleteMapping("/patients/allergies/{allergieId}")
    public ResponseEntity<Void> deleteAllergie(@PathVariable Long allergieId) {
        dossierMedicalService.deleteAllergie(allergieId);
        return ResponseEntity.noContent().build(); // 204
    }

    @PostMapping("/patients/{id}/maladies")
    public MaladieResponse addMaladie(
            @PathVariable Long id,
            @RequestBody @Valid CreateMaladieRequest request){
        var maladie = dossierMedicalService.addMaladie(id, request);
        return new MaladieResponse(maladie.getId(),maladie.getLabel(),
                maladie.getCode(),
                maladie.getSystemeCode(),
                maladie.getStatut(),
                maladie.getNotes(),
                maladie.getDateDebut(),
                maladie.getDateFin());
    }

    // Maladie - PATCH
    @PatchMapping("/patients/maladies/{maladieId}")
    public MaladieResponse updateMaladie(@PathVariable Long maladieId,
                                        @RequestBody UpdateMaladieRequest req) {
        var m = dossierMedicalService.updateMaladie(maladieId, req);
        return new MaladieResponse(m.getId(), m.getLabel(), m.getCode(), m.getSystemeCode(),
                m.getStatut(), m.getNotes(), m.getDateDebut(), m.getDateFin());
    }

    // Maladie - DELETE
    @DeleteMapping("/patients/maladies/{maladieId}")
    public ResponseEntity<Void> deleteMaladie(@PathVariable Long maladieId) {
        dossierMedicalService.deleteMaladie(maladieId);
        return ResponseEntity.noContent().build(); // 204
    }

    //ajouter un signe vital pour un patient
    @PostMapping("/patients/{id}/signeVitaux")
    public ResponseEntity<SigneVItalResponse> addSigneVital(
            @PathVariable Long id,
            @RequestBody @Valid CreateSigneVitalRequest req){
        var signe_vital = dossierMedicalService.addSigneVital(id, req);
        System.out.println("=== DTO reçu ===");
        System.out.println("Temp: " + req.getTemperature());
        System.out.println("Tension: " + req.getTension());
        System.out.println("FR: " + req.getFrequenceRespiratoire());
        System.out.println("SpO2: " + req.getSaturationOxygene());
        System.out.println("Poids: " + req.getPoids());
        System.out.println("Taille: " + req.getTaille());
        System.out.println("Commentaire: " + req.getCommentaire());
        SigneVItalResponse response = new SigneVItalResponse(
                signe_vital.getId(),
                signe_vital.getTemperature(),
                signe_vital.getTension(),
                signe_vital.getFrequenceRespiratoire(),
                signe_vital.getSaturationOxygene(),
                signe_vital.getPoids(),
                signe_vital.getTaille(),
                signe_vital.getCommentaire()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/patients/signeVitaux/{id}")
    public ResponseEntity<SigneVItalResponse> updateSigneVital(
            @PathVariable Long id,
            @RequestBody UpdateSigneVitalRequest req) {
        var signe = dossierMedicalService.updateSigneVital(id, req);
        SigneVItalResponse response = new SigneVItalResponse(
                signe.getId(),
                signe.getTemperature(), signe.getTension(), signe.getFrequenceRespiratoire(),
                signe.getSaturationOxygene(),signe.getPoids(),signe.getTaille(), signe.getCommentaire()
        );

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/patients/signeVitaux/{id}")
    public ResponseEntity<Void> deleteSigneVital(@PathVariable Long id) {
        dossierMedicalService.deleteSigneVital(id);
        return ResponseEntity.noContent().build();
    }

    //upload image d'identité
    /*@PostMapping(value = "/upload-photo", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadPhoto(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            org.springframework.security.core.Authentication auth,
            @Value("${app.upload.dir}") String uploadDir
    ) throws Exception{
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "UNAUTHORIZED"));
        }

        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "EMPTY_FILE"));
        }
        // --- Validation type & taille ---
        String contentType = file.getContentType();
        var allowed = java.util.Set.of("image/jpeg", "image/png", "image/webp");
        if (contentType == null || !allowed.contains(contentType)) {
            return ResponseEntity.status(415).body(Map.of("error", "UNSUPPORTED_TYPE", "allowed", allowed));
        }
        long maxBytes = 5L * 1024 * 1024; // 5 MB
        if (file.getSize() > maxBytes) {
            return ResponseEntity.status(413).body(Map.of("error", "FILE_TOO_LARGE", "limit", "5MB"));
        }
        // --- Extension selon type ---
        String ext = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/webp" -> ".webp";
            default -> "";
        };
        // --- Répertoire destination ---
        java.nio.file.Path base = java.nio.file.Paths.get(uploadDir).resolve("profile").normalize();
        java.nio.file.Files.createDirectories(base);

        // --- Supprimer l’ancienne photo si existante ---
        if (user.getImage() != null && !user.getImage().isBlank()) {
            String relOld = user.getImage().replaceFirst("^/files/", "");
            java.nio.file.Path oldPath = java.nio.file.Paths.get(uploadDir).resolve(relOld).normalize();
            try { java.nio.file.Files.deleteIfExists(oldPath); } catch (Exception ignore) {}
        }
        // --- Nom de fichier unique ---
        String safeName = (user.getId() != null ? (user.getId() + "_") : "")
                + java.util.UUID.randomUUID() + ext;

        java.nio.file.Path dest = base.resolve(safeName).normalize();

        // --- Copie du contenu ---
        try (var in = file.getInputStream()) {
            java.nio.file.Files.copy(in, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        }
        // --- Mettre à jour le chemin stocké en DB (cohérent avec myImage) ---
        user.setImage("/files/medecins/profile/" + safeName);
        // (optionnel si tu as ces colonnes)
        // user.setPhotoContentType(contentType);
        // user.setPhotoSize(file.getSize());
        // user.setPhotoFilename(safeName);

        userRepository.save(user);

        // Le front continue à consommer /api/Patient/myImage
        return ResponseEntity.ok(Map.of(
                "message", "OK",
                "imageUrl", "/api/Medecin/myImage"
        ));
    }*/

    // User image
    @GetMapping("/myImage")
    public ResponseEntity<org.springframework.core.io.Resource> myImage(
            org.springframework.security.core.Authentication auth,
            @Value("${app.upload.dir}") String uploadDir
    ) throws Exception {
        if (auth == null) return ResponseEntity.status(401).build();

        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getImage() == null) {
            return ResponseEntity.notFound().build(); // où renvoyer une image par défaut
        }

        // user.image est par ex. "/files/Medecin/abc.jpg"
        String relative = user.getImage().replaceFirst("^/files/", ""); // -> "profile/abc.jpg"
        java.nio.file.Path file = java.nio.file.Paths.get(uploadDir).resolve(relative).normalize();

        if (!java.nio.file.Files.exists(file)) return ResponseEntity.notFound().build();

        var res = new org.springframework.core.io.UrlResource(file.toUri());
        String ct = java.nio.file.Files.probeContentType(file); // "image/jpeg", etc.

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(ct != null ? ct : "application/octet-stream"))
                .body(res);
    }


    @GetMapping("/myLogo")
    public ResponseEntity<org.springframework.core.io.Resource> myLogo(
            org.springframework.security.core.Authentication auth,
            @Value("${app.upload.dir}") String uploadDir
    ) throws Exception {
        if (auth == null) return ResponseEntity.status(401).build();

        var user = medecinRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getLogoUrl() == null) {
            return ResponseEntity.notFound().build(); // où renvoyer une image par défaut
        }

        // user.image est par ex. "/files/Medecin/abc.jpg"
        String relative = user.getLogoUrl().replaceFirst("^/files/", ""); // -> "profile/abc.jpg"
        java.nio.file.Path file = java.nio.file.Paths.get(uploadDir).resolve(relative).normalize();

        if (!java.nio.file.Files.exists(file)) return ResponseEntity.notFound().build();

        var res = new org.springframework.core.io.UrlResource(file.toUri());
        String ct = java.nio.file.Files.probeContentType(file); // "image/jpeg", etc.

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(ct != null ? ct : "application/octet-stream"))
                .body(res);
    }

    @GetMapping("/mySignature")
    public ResponseEntity<org.springframework.core.io.Resource> mySignature(
            org.springframework.security.core.Authentication auth,
            @Value("${app.upload.dir}") String uploadDir
    ) throws Exception {
        if (auth == null) return ResponseEntity.status(401).build();

        var user = medecinRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (user.getSignatureUrl() == null) {
            return ResponseEntity.notFound().build(); // où renvoyer une image par défaut
        }

        // user.image est par ex. "/files/Medecin/abc.jpg"
        String relative = user.getSignatureUrl().replaceFirst("^/files/", ""); // -> "profile/abc.jpg"
        java.nio.file.Path file = java.nio.file.Paths.get(uploadDir).resolve(relative).normalize();

        if (!java.nio.file.Files.exists(file)) return ResponseEntity.notFound().build();

        var res = new org.springframework.core.io.UrlResource(file.toUri());
        String ct = java.nio.file.Files.probeContentType(file); // "image/jpeg", etc.

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(ct != null ? ct : "application/octet-stream"))
                .body(res);
    }


    @PostMapping(value = "/upload-photo", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadPhoto(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            org.springframework.security.core.Authentication auth,
            @Value("${app.upload.dir}") String uploadDir
    ) throws Exception {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "UNAUTHORIZED"));
        }

        var user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "EMPTY_FILE"));
        }

        // --- Validation type & taille ---
        String contentType = file.getContentType();
        var allowed = java.util.Set.of("image/jpeg", "image/png", "image/webp");
        if (contentType == null || !allowed.contains(contentType)) {
            return ResponseEntity.status(415).body(Map.of("error", "UNSUPPORTED_TYPE", "allowed", allowed));
        }
        long maxBytes = 5L * 1024 * 1024; // 5 MB
        if (file.getSize() > maxBytes) {
            return ResponseEntity.status(413).body(Map.of("error", "FILE_TOO_LARGE", "limit", "5MB"));
        }

        // --- Extension selon type ---
        String ext = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/webp" -> ".webp";
            default -> "";
        };

        // --- Répertoire destination ---
        // Répertoire destination **cohérent** avec le chemin DB "/files/patients/profile/..."
        java.nio.file.Path root = java.nio.file.Paths.get(uploadDir).normalize();
        java.nio.file.Path base = root.resolve("medecins").resolve(user.getCin()).resolve("profile").normalize();
        java.nio.file.Files.createDirectories(base); // crée "patients/profile" si absent

        // --- Supprimer l’ancienne photo si existante ---
        /*if (user.getImage() != null && !user.getImage().isBlank()) {
            String relOld = user.getImage().replaceFirst("^/files/", "");
            java.nio.file.Path oldPath = java.nio.file.Paths.get(uploadDir).resolve(relOld).normalize();
            try { java.nio.file.Files.deleteIfExists(oldPath); } catch (Exception ignore) {}
        }*/
        // Supprimer l’ancienne photo si elle est dans /files/...
        String oldImage = user.getImage();
        if (oldImage != null && !oldImage.isBlank() && oldImage.startsWith("/files/")) {
            String relOld = oldImage.replaceFirst("^/files/", ""); // ex: "patients/profile/abc.jpg".
            java.nio.file.Path oldPath = root.resolve(relOld).normalize();
            if (oldPath.startsWith(root)) { // garde-fou
                try {
                    java.nio.file.Files.deleteIfExists(oldPath);
                } catch (Exception e) {
                    // log si besoin, mais ne pas bloquer l’upload
                }
            }
        }

        // --- Nom de fichier unique ---
        String safeName = (user.getId() != null ? (user.getId() + "_"+ user.getNom() + "_" + user.getPrenom()+ "_") : "")
                + java.util.UUID.randomUUID() + ext;

        java.nio.file.Path dest = base.resolve(safeName).normalize();

        // --- Copie du contenu ---
        try (var in = file.getInputStream()) {
            java.nio.file.Files.copy(in, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        }

        // --- Mettre à jour le chemin stocké en DB (cohérent avec myImage) ---
        user.setImage("/files/medecins/"+user.getCin()+"/profile/" + safeName);
        // (optionnel si tu as ces colonnes)
        // user.setPhotoContentType(contentType);
        // user.setPhotoSize(file.getSize());
        // user.setPhotoFilename(safeName);

        userRepository.save(user);

        // Le front continue à consommer /api/Patient/myImage
        return ResponseEntity.ok(Map.of(
                "message", "OK",
                "imageUrl", "/api/Medecin/myImage"
        ));
    }

    @PostMapping(value = "/upload-logo", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadLogo(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            org.springframework.security.core.Authentication auth,
            @Value("${app.upload.dir}") String uploadDir
    ) throws Exception {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "UNAUTHORIZED"));
        }

        var med = medecinRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "EMPTY_FILE"));
        }

        // --- Validation type & taille ---
        String contentType = file.getContentType();
        var allowed = java.util.Set.of("image/jpeg", "image/png", "image/webp");
        if (contentType == null || !allowed.contains(contentType)) {
            return ResponseEntity.status(415).body(Map.of("error", "UNSUPPORTED_TYPE", "allowed", allowed));
        }
        long maxBytes = 5L * 1024 * 1024; // 5 MB
        if (file.getSize() > maxBytes) {
            return ResponseEntity.status(413).body(Map.of("error", "FILE_TOO_LARGE", "limit", "5MB"));
        }

        // --- Extension selon type ---
        String ext = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/webp" -> ".webp";
            default -> "";
        };

        // --- Répertoire destination ---
        // Répertoire destination **cohérent** avec le chemin DB "/files/patients/profile/..."
        java.nio.file.Path root = java.nio.file.Paths.get(uploadDir).normalize();
        java.nio.file.Path base = root.resolve("medecins").resolve(med.getCin()).resolve("logo").normalize();
        java.nio.file.Files.createDirectories(base); // crée "patients/profile" si absent

        String oldImage = med.getLogoUrl();
        if (oldImage != null && !oldImage.isBlank() && oldImage.startsWith("/files/")) {
            String relOld = oldImage.replaceFirst("^/files/", "");
            java.nio.file.Path oldPath = root.resolve(relOld).normalize();
            if (oldPath.startsWith(root)) { // garde-fou
                try {
                    java.nio.file.Files.deleteIfExists(oldPath);
                } catch (Exception e) {
                    // log si besoin, mais ne pas bloquer l’upload
                }
            }
        }

        // --- Nom de fichier unique ---
        String safeName = (med.getId() != null ? (med.getId() + "_"+ med.getNom() + "_" +med.getPrenom()+ "_") : "")
                + java.util.UUID.randomUUID() + ext;

        java.nio.file.Path dest = base.resolve(safeName).normalize();

        // --- Copie du contenu ---
        try (var in = file.getInputStream()) {
            java.nio.file.Files.copy(in, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        }

        // --- Mettre à jour le chemin stocké en DB (cohérent avec myImage) ---
        med.setLogoUrl("/files/medecins/"+med.getCin()+"/logo/" + safeName);

        medecinRepository.save(med);

        // Le front continue à consommer /api/Patient/myImage
        return ResponseEntity.ok(Map.of(
                "message", "OK",
                "imageUrl", "/api/Medecin/myLogo"
        ));
    }

    @PostMapping(value = "/upload-signature", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadSignature(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            org.springframework.security.core.Authentication auth,
            @Value("${app.upload.dir}") String uploadDir
    ) throws Exception {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body(Map.of("error", "UNAUTHORIZED"));
        }

        var med = medecinRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "EMPTY_FILE"));
        }

        // --- Validation type & taille ---
        String contentType = file.getContentType();
        var allowed = java.util.Set.of("image/jpeg", "image/png", "image/webp");
        if (contentType == null || !allowed.contains(contentType)) {
            return ResponseEntity.status(415).body(Map.of("error", "UNSUPPORTED_TYPE", "allowed", allowed));
        }
        long maxBytes = 5L * 1024 * 1024; // 5 MB
        if (file.getSize() > maxBytes) {
            return ResponseEntity.status(413).body(Map.of("error", "FILE_TOO_LARGE", "limit", "5MB"));
        }

        // --- Extension selon type ---
        String ext = switch (contentType) {
            case "image/jpeg" -> ".jpg";
            case "image/png"  -> ".png";
            case "image/webp" -> ".webp";
            default -> "";
        };

        // --- Répertoire destination ---
        // Répertoire destination **cohérent** avec le chemin DB "/files/patients/profile/..."
        java.nio.file.Path root = java.nio.file.Paths.get(uploadDir).normalize();
        java.nio.file.Path base = root.resolve("medecins").resolve(med.getCin()).resolve("signature").normalize();
        java.nio.file.Files.createDirectories(base); // crée "patients/profile" si absent

        String oldImage = med.getSignatureUrl();
        if (oldImage != null && !oldImage.isBlank() && oldImage.startsWith("/files/")) {
            String relOld = oldImage.replaceFirst("^/files/", "");
            java.nio.file.Path oldPath = root.resolve(relOld).normalize();
            if (oldPath.startsWith(root)) { // garde-fou
                try {
                    java.nio.file.Files.deleteIfExists(oldPath);
                } catch (Exception e) {
                    // log si besoin, mais ne pas bloquer l’upload
                }
            }
        }

        // --- Nom de fichier unique ---
        String safeName = (med.getId() != null ? (med.getId() + "_"+ med.getNom() + "_" +med.getPrenom()+ "_") : "")
                + java.util.UUID.randomUUID() + ext;

        java.nio.file.Path dest = base.resolve(safeName).normalize();

        // --- Copie du contenu ---
        try (var in = file.getInputStream()) {
            java.nio.file.Files.copy(in, dest, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
        }

        // --- Mettre à jour le chemin stocké en DB (cohérent avec myImage) ---
        med.setSignatureUrl("/files/medecins/"+med.getCin()+"/signature/" + safeName);

        medecinRepository.save(med);

        // Le front continue à consommer /api/Patient/myImage
        return ResponseEntity.ok(Map.of(
                "message", "OK",
                "imageUrl", "/api/Medecin/mySignature"
        ));
    }

    @PostMapping("/changerMotDePasse")
    @Transactional
    public ResponseEntity<?> changeMotDePasse(@Valid @RequestBody ChangePasswordRequest req) {
        String email = getCurrentUserEmail();
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Medecin non trouvé: " + email));

        // Vérif ancien (401 si faux)
        if (!passwordEncoder.matches(req.getOldPassword(), medecin.getMotdepasse())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
        }

        // Règles (400 si invalide)
        String reason = null;
        if (req.getNewPassword() == null || req.getConfirmNewPassword() == null) {
            reason = "Champs manquants.";
        } else if (!req.getNewPassword().equals(req.getConfirmNewPassword())) {
            reason = "La confirmation ne correspond pas.";
        } else if (req.getNewPassword().length() < 6) {
            reason = "Le nouveau mot de passe doit contenir au moins 6 caractères.";
        } else if (passwordEncoder.matches(req.getNewPassword(), medecin.getMotdepasse())) {
            reason = "Le nouveau mot de passe ne doit pas être identique à l'ancien.";
        }
        if (reason != null) return ResponseEntity.badRequest().body(reason);

        // OK: encoder + save
        medecin.setMotdepasse(passwordEncoder.encode(req.getNewPassword()));
        medecin.setPasswordlength(req.getNewPassword().length());
        // (optionnel) si tu stockes password_length en DB:
        // p.setPasswordLength(req.getNewPassword().length());
        medecinRepository.save(medecin);
        return ResponseEntity.noContent().build();
    }

    /*@PostMapping("/factures")
    public ResponseEntity<FactureResponse> create(@RequestBody @Valid CreateFactureRequest req) {
        String email = getCurrentUserEmail();
        Facture f = factureService.createAndGenerate(email, req);
        var resp = new FactureResponse(
                f.getId(), f.getNumero(),
                f.getPatient().getNom()+" "+f.getPatient().getPrenom(),
                f.getStatut(), f.getTotalHT(), f.getTotalTVA(), f.getTotalTTC()
        );
        return ResponseEntity.ok(resp);
    }
*/
    /*@PostMapping
    public ResponseEntity<PrescriptionResponse> create(@RequestBody @Valid CreatePrescriptionRequest req){
        var p = prescriptionService.create(getCurrentUserEmail(), req);
        var resp = new PrescriptionResponse();
        resp.id = p.getId();
        resp.patientNom = p.getPatient().getNom()+" "+p.getPatient().getPrenom();
        resp.date = p.getDate();
        resp.medicaments = p.getMedicaments();
        return ResponseEntity.ok(resp);
    }*/

    @GetMapping("/receptionnistes")
    public Iterable<ReceptionnisteDto> mesReceptionnistes(){
        String email = getCurrentUserEmail();
        Medecin m = medecinRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Medecin non trouvé: " + email));

        // si tu as un soft-delete sur Receptionniste (ex: is_deleted), filtre-le ici
        return m.getReceptionnistes()
                .stream()
                // .filter(r -> !Boolean.TRUE.equals(r.getIs_deleted()))
                .map(receptionnisteDTOMapper::toDto)
                .toList();

    }
    @PostMapping("/receptionnistes")
    @Transactional
    public ResponseEntity<ReceptionnisteDto> createReceptionniste(
            @Valid @RequestBody AddReceptionnisteDto request,
            UriComponentsBuilder uriBuilder
    ){

        // 1) vérifs basiques
        if (request.getMotdepasse() == null ||
                !request.getMotdepasse().equals(request.getConfirmpwd())) {
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }

        String email = getCurrentUserEmail();
        Medecin m = medecinRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Medecin non trouvé: " + email));

        // 3) créer la réceptionniste
        Receptionniste r = receptionnisteDTOMapper.toEntity(request);
        r.setRole(Role.RECEPTIONNISTE);
        r.setMotdepasse(passwordEncoder.encode(r.getMotdepasse()));
        receptionnisteRepository.save(r);

        // 4) l’affecter au médecin (côté propriétaire ManyToMany = Medecin)
        m.getReceptionnistes().add(r);
        medecinRepository.save(m);

        // 5) réponse 201 Created
        ReceptionnisteDto dto = receptionnisteDTOMapper.toDto(r);
        var location = uriBuilder.path("/api/medecin/receptionnistes/{id}")
                .buildAndExpand(dto.getId())
                .toUri();

        return ResponseEntity.created(location).body(dto);
    }

    @PatchMapping("/receptionnistes/{id}")
    @Transactional
    public ResponseEntity<?> updateReceptionniste(
            @PathVariable Long id,
            @Valid @RequestBody UpdateReceptionnisteRequest request
    ){
        // 1) Récupérer le médecin connecté
        String email = getCurrentUserEmail(); // garde ta méthode utilitaire existante
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé: " + email));
        // 2) Récupérer la réceptionniste appartenant à ce médecin
        Receptionniste r = receptionnisteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réceptionniste introuvable pour ce médecin."));
        // 3) Appliquer les updates partiels (si non vides)
        if (request.getNom() != null && !request.getNom().trim().isEmpty()) {
            r.setNom(request.getNom().trim());
        }
        if (request.getPrenom() != null && !request.getPrenom().trim().isEmpty()) {
            r.setPrenom(request.getPrenom().trim());
        }
        if (request.getTelephone() != null && !request.getTelephone().trim().isEmpty()) {
            r.setTelephone(request.getTelephone().trim());
        }
        //  Email (unicité si modifié)
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String newEmail = request.getEmail().trim();
            if (!newEmail.equalsIgnoreCase(r.getEmail())
                    && receptionnisteRepository.existsByEmailAndIdNot(newEmail, r.getId())) {
                return ResponseEntity.status(409).body("Cet e-mail est déjà utilisé.");
            }
            r.setEmail(newEmail);
        }
        // CIN (unicité si modifié)
        if (request.getCin() != null && !request.getCin().trim().isEmpty()) {
            String newCin = request.getCin().trim();
            if (!newCin.equalsIgnoreCase(r.getCin())
                    && receptionnisteRepository.existsByCinAndIdNot(newCin, r.getId())) {
                return ResponseEntity.status(409).body("Ce CIN est déjà utilisé.");
            }
            r.setCin(newCin);
        }


        // 4) Sauvegarder & retourner un DTO propre
        Receptionniste saved = receptionnisteRepository.save(r);
        ReceptionnisteDto dto = receptionnisteDTOMapper.toDto(saved);
        return ResponseEntity.ok(dto);
    }
    @PostMapping("/receptionnistes/{id}/changerMotDePasse")
    @Transactional
    public ResponseEntity<?> changeMotDePasse(
            @PathVariable Long id,
            @Valid @RequestBody ChangePasswordRequest req
    ) {
        // 1) Médecin connecté
        String email = getCurrentUserEmail();
        Medecin medecin = medecinRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Médecin non trouvé: " + email));

        // 2) Vérifier que la réceptionniste appartient bien à ce médecin
        Receptionniste recep = receptionnisteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Réceptionniste introuvable pour ce médecin."));

        // 3) Vérification de l’ancien mot de passe (401 si faux)
        if (!passwordEncoder.matches(req.getOldPassword(), recep.getMotdepasse())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Ancien mot de passe incorrect.");
        }

        // 4) Vérifications sur le nouveau mot de passe
        String reason = null;
        if (req.getNewPassword() == null || req.getConfirmNewPassword() == null) {
            reason = "Champs manquants.";
        } else if (!req.getNewPassword().equals(req.getConfirmNewPassword())) {
            reason = "La confirmation ne correspond pas.";
        } else if (req.getNewPassword().length() < 6) {
            reason = "Le nouveau mot de passe doit contenir au moins 6 caractères.";
        } else if (passwordEncoder.matches(req.getNewPassword(), recep.getMotdepasse())) {
            reason = "Le nouveau mot de passe ne doit pas être identique à l'ancien.";
        }
        if (reason != null) {
            return ResponseEntity.badRequest().body(reason);
        }

        // 5) Encoder et sauvegarder
        recep.setMotdepasse(passwordEncoder.encode(req.getNewPassword()));
        // si tu as un champ optionnel passwordLength dans ton entité
        // recep.setPasswordlength(req.getNewPassword().length());

        receptionnisteRepository.save(recep);

        return ResponseEntity.noContent().build();
    }



}

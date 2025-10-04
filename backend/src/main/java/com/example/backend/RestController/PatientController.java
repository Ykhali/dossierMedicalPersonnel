package com.example.backend.RestController;

import com.example.backend.Dao.*;
import com.example.backend.Dto.*;
import com.example.backend.Entity.*;
import com.example.backend.Entity.Enums.StatusRendezVous;
import com.example.backend.Service.ServiceImpl.JwtService;
import com.example.backend.Service.ServiceImpl.MedecinSearchService;
import com.example.backend.Service.ServiceImpl.PhoneUtil;
import com.example.backend.Service.ServiceImpl.PhoneVerifyService;
import com.example.backend.mapper.historiqueRvMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import com.example.backend.mapper.RendezVousDtoMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import static com.example.backend.config.SecurityUtils.getCurrentUserEmail;


@RestController
@RequestMapping("/api/Patient")
public class PatientController {

    @Autowired private PatientRepository patientRepository;
    @Autowired private RendezVousRepository rendezVousRepository;
    @Autowired private MedecinRepository medecinRepository;
    @Autowired private RendezVousDtoMapper rendezVousDtoMapper;
    @Autowired private HistoriqueRendezVousRepository historiqueRendezVousRepository;
    @Autowired private historiqueRvMapper historiqueRvMapper;
    @Autowired private UserRepository userRepository;
    @Autowired private PhoneVerifyService phoneVerifyService;
    @Autowired private JwtService jwtService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private MedecinAbsenceRepository medecinAbsenceRepository;
    @Autowired
    private MedecinHoraireRepository medecinHoraireRepository;

    private static final DateTimeFormatter HHMM = DateTimeFormatter.ofPattern("HH:mm");
    @Autowired
    private MedecinSearchService medecinSearchService;


    /*@PostMapping
    public ResponseEntity<?> registerPatient(
            @Valid @RequestBody AddPatientDto request,
            UriComponentsBuilder uriBuilder) {
        if (patientRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(
                    Map.of("email","Email déja enregistrer.")
            );
        }
        var p = patientDTOMapper.toEntity(request);
        p.setMotDePasse(passwordEncoder.encode(p.getMotDePasse()));
        p.setRole(Role.PATIENT);
        patientRepository.save(p);

        var patientDto = patientDTOMapper.toDto(p);
        var uri = uriBuilder.path("/patients/{id}").buildAndExpand(patientDto.getId()).toUri();
        return  ResponseEntity.created(uri).body(patientDto);
    }*/
    /*@PostMapping("/rendezVous")
    public ResponseEntity<RendezVousDto> createRendezVous(
            @Valid @RequestBody CreateRendezVousDto request,
            UriComponentsBuilder uriBuilder) {

        //email du user connecté
        String email = getCurrentUserEmail();
        //Patient patient = patientRepository.findByEmail(email).orElse(null);

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        var medecin = medecinRepository.findById(request.getMedecinId()).orElse(null);

        if(medecin == null || patient == null) {
            if (medecin == null) System.err.println("Medecin non trouvable");
            //if (patient == null) System.err.println("Patient non trouvable");
            return ResponseEntity.badRequest().build();
        }

        var rv = rendezVousDtoMapper.toEntity(request);
        rv.setMedecin(medecin);
        rv.setPatient(patient);
        rv.setStatus(StatusRendezVous.Confirmé);
        rv.setDateCreation(LocalDate.now());

        rendezVousRepository.save(rv);

        var historiqueRV = new HistoriqueRendezVous(
                null,
                rv.getId(),
                request.getDate(),
                LocalDate.now(),
                request.getHeure(),
                request.getMotif(),
                StatusRendezVous.Confirmé,
                medecin,
                patient
        );
        historiqueRendezVousRepository.save(historiqueRV);


        var rendezVousDto = rendezVousDtoMapper.toDto(rv);

        var uri = uriBuilder.path("/RendezVous/{id}").buildAndExpand(rv.getId()).toUri();
        return ResponseEntity.created(uri).body(rendezVousDto);
    }*/
    /*@PostMapping("/rendezVous")
    public ResponseEntity<RendezVousDto> createRendezVous(
            @Valid @RequestBody CreateRendezVousDto request,
            UriComponentsBuilder uriBuilder) {

        //email du user connecté
        String email = getCurrentUserEmail();
        //Patient patient = patientRepository.findByEmail(email).orElse(null);

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        var medecin = medecinRepository.findById(request.getMedecinId()).orElse(null);

        if(medecin == null || patient == null) {
            if (medecin == null) System.err.println("Medecin non trouvable");
            //if (patient == null) System.err.println("Patient non trouvable");
            return ResponseEntity.badRequest().build();
        }

        var rv = rendezVousDtoMapper.toEntity(request);
        rv.setMedecin(medecin);
        rv.setPatient(patient);
        rv.setStatus(StatusRendezVous.Confirmé);
        rv.setDateCreation(LocalDate.now());

        rendezVousRepository.save(rv);

        var historiqueRV = new HistoriqueRendezVous(
                null,
                rv.getId(),
                request.getDate(),
                LocalDate.now(),
                request.getHeure(),
                request.getMotif(),
                StatusRendezVous.Confirmé,
                medecin,
                patient
        );
        historiqueRendezVousRepository.save(historiqueRV);


        var rendezVousDto = rendezVousDtoMapper.toDto(rv);

        var uri = uriBuilder.path("/RendezVous/{id}").buildAndExpand(rv.getId()).toUri();
        return ResponseEntity.created(uri).body(rendezVousDto);
    }






    @PutMapping("/rendezVous/{id}")
    public ResponseEntity<RendezVousDto> updateRendezVous(@PathVariable Long id, @RequestBody UpdateRendezVousDto request, UriComponentsBuilder uriBuilder) {
        String email = getCurrentUserEmail();
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvable"));

        RendezVous rv = rendezVousRepository.findById(id).orElse(null);
        if(rv == null) {
            return ResponseEntity.notFound().build();
        }
        if (request.getDate() != null) rv.setDate(request.getDate());
        if (request.getHeure() != null) rv.setHeure(request.getHeure());
        if (request.getMotif() != null) rv.setMotif(request.getMotif());

        if (request.getMedecinId() != null) {
            Medecin medecin = medecinRepository.findById(request.getMedecinId()).orElse(null);
            if (medecin != null) {
                rv.setMedecin(medecin);
            }
        }
        rendezVousRepository.save(rv);
        return ResponseEntity.ok(rendezVousDtoMapper.toDto(rv));
    }

    @GetMapping("/rendezVous/{id}")
    public ResponseEntity<RendezVousDto> getRendezVous(@PathVariable Long id) {
        var rv = rendezVousRepository.findById(id).orElse(null);
        if(rv == null) {
            return ResponseEntity.notFound().build();
        }
        var rendezVousDto = new RendezVousDto(rv.getId(),
                rv.getDate(),
                rv.getDateCreation(),
                rv.getHeure(),
                rv.getMotif(),
                rv.getMedecin(),
                rv.getStatus(),
                rv.getPatient() );
        return ResponseEntity.ok(rendezVousDto);
    }

    @GetMapping("/rendezvous")
    public ResponseEntity<List<RendezVousDto>> getAllRendezVous() {
        String email = getCurrentUserEmail();
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        List<RendezVous> rendezVousList = rendezVousRepository.findByPatient(patient);
        List<RendezVousDto> dtoList = rendezVousList.stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/rendezvous/historique")
    public ResponseEntity<List<HistoriqueRendezVousDto>> getHistoriqueRendezVous() {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvable"));
        List<HistoriqueRendezVous> historiqueRendezVousList = historiqueRendezVousRepository.findByPatient(p);
        List<HistoriqueRendezVousDto> dtoList = historiqueRendezVousList.stream().map(historiqueRvMapper::toDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/rendezvous/confirmé")//afficher tous les rendez-vous avec le status confirmé
    public ResponseEntity<List<RendezVousDto>> getConfirmedAppointments() {
        String email = getCurrentUserEmail();
        Patient patient = patientRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Patient non trouvable"));
        var statusString = "Confirmé";
        StatusRendezVous status = StatusRendezVous.valueOf(statusString);
        List<RendezVous> rendezVousList = rendezVousRepository.findByPatientAndStatus(patient, status);
        List<RendezVousDto> dtoList = rendezVousList.stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtoList);
    }*/
    /*@DeleteMapping("/rendezvous/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        var rv = rendezVousRepository.findById(id).orElse(null);
        var historiqueRDV = historiqueRendezVousRepository.findByIdRDV(id).orElse(null);
        if(rv == null ) {
            return ResponseEntity.notFound().build();
        }
        historiqueRDV.setStatus(StatusRendezVous.Annulé);
        historiqueRDV.setDateDAnnulation(LocalDate.now());
        rendezVousRepository.delete(rv);
        System.out.println("RendezVous Supptimé!!!");
        return ResponseEntity.noContent().build();
    }*/
    /*@DeleteMapping("/rendezvous/{id}")
    @Transactional
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        var rvOpt = rendezVousRepository.findById(id);
        if (rvOpt.isEmpty()) return ResponseEntity.notFound().build();
        var rv = rvOpt.get();

        // Marquer l’historique s’il existe (le plus récent)
        var list = historiqueRendezVousRepository.findByRvIdOrderByDateCreationDesc(id);
        if (!list.isEmpty()) {
            var hrv = list.get(0);
            hrv.setStatus(StatusRendezVous.Annulé);
            hrv.setDateDAnnulation(LocalDate.now());
            // @Transactional => dirty checking suffisant
        }

        // Soft-delete conseillé : garder la trace et éviter les soucis de FK
        rv.setStatus(StatusRendezVous.Annulé);

        //supprimer la ligne :
        rendezVousRepository.delete(rv);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/changerMotDePasse")
    public ResponseEntity<Void> changeMotDePasse(@PathVariable Long id, @RequestBody ChangePasswordRequest request) {
        String email = getCurrentUserEmail();
        var p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        if(p == null) {
            return ResponseEntity.notFound().build();
        }
        if(!p.getMotdepasse().equals(request.getOldPassword())){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if(!request.getNewPassword().equals(request.getConfirmNewPassword())){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }else{
            p.setMotdepasse(request.getNewPassword());
            p.setMotdepasse(request.getConfirmNewPassword());
            patientRepository.save(p);
            return ResponseEntity.noContent().build();
        }
    }*/
    /*@GetMapping("/me/photo")
    public ResponseEntity<byte[]> getPhoto() {
        String email = getCurrentUserEmail();
        var user = userRepository.findByEmail(email);

        if(user.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        var usr = user.get();
        byte[] imgBytes = usr.getPhotoIdentite();
        String contentType = usr.getPhotoContentType();

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(imgBytes);
    }*/
    // ------------------- CREATE RDV -------------------
    /*@PostMapping("/rendezvous")
    public ResponseEntity<RendezVousDto> createRendezVous(
            @Valid @RequestBody CreateRendezVousDto request,
            UriComponentsBuilder uriBuilder) {

        // 1) Email du user connecté
        String email = getCurrentUserEmail();

        // 2) Récupérer UNIQUEMENT l’ID du patient (pas l’entité => pas de BLOB)
        Long patientId = patientRepository.findIdByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        // 3) Obtenir des références (proxies) SANS SELECT (donc SANS BLOB)
        Patient patientRef = patientRepository.getReferenceById(patientId);

        Long medecinId = request.getMedecinId();
        if (!medecinRepository.existsById(medecinId)) {
            System.err.println("Medecin non trouvable");
            return ResponseEntity.badRequest().build();
        }
        Medecin medecinRef = medecinRepository.getReferenceById(medecinId);

        // 4) Construire & sauvegarder le RDV
        RendezVous rv = rendezVousDtoMapper.toEntity(request);
        rv.setMedecin(medecinRef);
        rv.setPatient(patientRef);
        rv.setStatus(StatusRendezVous.Confirmé);
        rv.setDateCreation(LocalDate.now());

        rv = rendezVousRepository.save(rv);

        // 5) Historique (toujours avec références/proxies, pas de BLOB)
        HistoriqueRendezVous historiqueRV = new HistoriqueRendezVous(
                null,
                rv.getId(),
                request.getDate(),
                LocalDate.now(),
                request.getHeure(),
                request.getMotif(),
                StatusRendezVous.Confirmé,
                medecinRef,
                patientRef
        );
        historiqueRendezVousRepository.save(historiqueRV);

        // 6) DTO de réponse — IMPORTANT : pas d'entités dans le DTO !
        RendezVousDto rendezVousDto = rendezVousDtoMapper.toDto(rv);

        URI uri = uriBuilder.path("/RendezVous/{id}").buildAndExpand(rv.getId()).toUri();
        return ResponseEntity.created(uri).body(rendezVousDto);
    }*/
    @PostMapping("/rendezvous")
    public ResponseEntity<RendezVousDto> createRendezVous(
            @Valid @RequestBody CreateRendezVousDto request,
            UriComponentsBuilder uriBuilder) {

        //email du user connecté
        String email = getCurrentUserEmail();
        System.out.println("EMAIL COURANT = " + email);
        //Patient patient = patientRepository.findByEmail(email).orElse(null);

        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        var medecin = medecinRepository.findById(request.getMedecinId()).orElse(null);

        if(medecin == null || patient == null) {
            if (medecin == null) System.err.println("Medecin non trouvable");
            //if (patient == null) System.err.println("Patient non trouvable");
            return ResponseEntity.badRequest().build();
        }

        var rv = rendezVousDtoMapper.toEntity(request);
        rv.setMedecin(medecin);
        rv.setPatient(patient);
        rv.setStatus(StatusRendezVous.Planifié);
        rv.setDateCreation(LocalDate.now());

        rendezVousRepository.save(rv);

        var historiqueRV = new HistoriqueRendezVous(
                null,
                rv.getId(),
                request.getDate(),
                LocalDate.now(),
                request.getHeure(),
                request.getMotif(),
                StatusRendezVous.Confirmé,
                medecin,
                patient
        );
        historiqueRendezVousRepository.save(historiqueRV);


        var rendezVousDto = rendezVousDtoMapper.toDto(rv);

        var uri = uriBuilder.path("/RendezVous/{id}").buildAndExpand(rv.getId()).toUri();
        return ResponseEntity.created(uri).body(rendezVousDto);
    }
    @PatchMapping("/rendezvous/{id}/reporter")
    @Transactional
    public ResponseEntity<?> reporterRendezVous(@PathVariable Long id,
                                                @Valid @RequestBody RescheduleRdvRequest req) {
        String email = getCurrentUserEmail();
        Patient me = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient introuvable"));

        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Rendez-vous introuvable"));

        // Autorisation : ce RDV doit appartenir au patient connecté
        if (rdv.getPatient() == null || !rdv.getPatient().getId().equals(me.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Vous ne pouvez pas modifier ce rendez-vous.");
        }

        // Statut
        if (rdv.getStatus() == StatusRendezVous.Annulé) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rendez-vous annulé.");
        }

        // Le RDV actuel ne doit pas être passé
        LocalTime currentHeure = LocalTime.parse(rdv.getHeure(), HHMM);
        if (java.time.LocalDateTime.of(rdv.getDate(), currentHeure).isBefore(java.time.LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rendez-vous déjà passé.");
        }

        // Nouvelles valeurs
        LocalDate newDate = req.newDate();
        // Prend HH:mm ou HH:mm:ss
        LocalTime newHeure = (req.newHeure().length() == 5)
                ? LocalTime.parse(req.newHeure(), DateTimeFormatter.ofPattern("HH:mm"))
                : LocalTime.parse(req.newHeure(), DateTimeFormatter.ofPattern("HH:mm:ss"));

        if (java.time.LocalDateTime.of(newDate, newHeure).isBefore(java.time.LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La nouvelle date est dans le passé.");
        }

        Long medecinId = rdv.getMedecin().getId();

        // === Vérifier que le créneau est "ouvré" ce jour-là (horaires/absences) ===
        // 1) Règle date-spécifique sinon hebdo
        List<MedecinHoraire> base = medecinHoraireRepository.findByMedecin_IdAndDateSpecific(medecinId, newDate);
        if (base.isEmpty()) {
            base = medecinHoraireRepository.findByMedecin_IdAndDayOfWeek(medecinId, newDate.getDayOfWeek());
        }
        if (base.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Aucun horaire pour cette date.");
        }

        // 2) Générer les slots candidats
        int slot = 30; // adapte si tu as slot_minutes en DB
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {
            LocalTime t = h.getHeureDebut();
            while (!t.plusMinutes(slot).isAfter(h.getHeureFin())) {
                candidates.add(t);
                t = t.plusMinutes(slot);
            }
        }

        // 3) Retirer les absences
        List<MedecinAbsence> absences = medecinAbsenceRepository.findByMedecin_IdAndDate(medecinId, newDate);
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

        // 4) Retirer les créneaux déjà pris (seulement statuts ACTIFS)
        var bookedSameDay = rendezVousRepository.findByMedecin_IdAndDateOrderByHeure(medecinId, newDate);
        Set<String> taken = bookedSameDay.stream()
                .filter(x -> x.getStatus() != StatusRendezVous.Annulé) // actifs = bloquants
                .filter(x -> !x.getId().equals(rdv.getId()))            // ignorer ce RDV lui-même
                .map(RendezVous::getHeure)
                .collect(Collectors.toSet());

        // 5) Si même jour, interdire le passé
        List<LocalTime> remaining;
        LocalDate today = LocalDate.now();
        if (newDate.isBefore(today)) {
            remaining = List.of();
        } else if (newDate.isEqual(today)) {
            LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
            int remainder = now.getMinute() % slot;
            if (remainder != 0) now = now.plusMinutes(slot - remainder);
            final LocalTime cutoff = now;
            remaining = candidates.stream().filter(t -> !t.isBefore(cutoff)).toList();
        } else {
            remaining = candidates;
        }

        List<String> free = remaining.stream()
                .map(HHMM::format)
                .filter(hhmm -> !taken.contains(hhmm))
                .sorted()
                .toList();

        if (!free.contains(HHMM.format(newHeure))) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Créneau indisponible."));
        }

        // === Appliquer le report ===
        LocalDate oldDate = rdv.getDate();
        String oldHeure = rdv.getHeure();

        rdv.setDate(newDate);
        rdv.setHeure(HHMM.format(newHeure)); // normaliser "HH:mm"
        // Status conservé (Planifié/Confirmé)

        rendezVousRepository.save(rdv);

        // Historiser (facultatif mais utile)
        HistoriqueRendezVous hrv = new HistoriqueRendezVous(
                null,
                rdv.getId(),
                newDate,
                LocalDate.now(),
                HHMM.format(newHeure),
                req.motif(),
                rdv.getStatus(),      // ex: Planifié
                rdv.getMedecin(),
                rdv.getPatient()
        );
        historiqueRendezVousRepository.save(hrv);

        return ResponseEntity.ok(Map.of(
                "message", "Rendez-vous reporté.",
                "rendezVous", rendezVousDtoMapper.toDto(rdv),
                "oldDate", oldDate.toString(),
                "oldHeure", oldHeure
        ));
    }


    // ------------------- UPDATE RDV -------------------
    @PutMapping("/rendezvous/{id}")
    public ResponseEntity<RendezVousDto> updateRendezVous(
            @PathVariable Long id,
            @RequestBody com.example.backend.Dto.UpdateRendezVousDto request,
            UriComponentsBuilder uriBuilder) {

        String email = getCurrentUserEmail();

        // ID patient uniquement (pas de BLOB)
        Long patientId = patientRepository.findIdByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvable"));
        Patient patientRef = patientRepository.getReferenceById(patientId);

        RendezVous rv = rendezVousRepository.findById(id).orElse(null);
        if (rv == null) return ResponseEntity.notFound().build();

        // (Optionnel) Vérifier l’appartenance du RDV au patient connecté
        if (rv.getPatient() == null || !rv.getPatient().getId().equals(patientRef.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        if (request.getDate() != null)  rv.setDate(request.getDate());
        if (request.getHeure() != null) rv.setHeure(request.getHeure());
        if (request.getMotif() != null) rv.setMotif(request.getMotif());

        if (request.getMedecinId() != null) {
            Long medId = request.getMedecinId();
            if (!medecinRepository.existsById(medId)) {
                return ResponseEntity.badRequest().build();
            }
            Medecin medecinRef = medecinRepository.getReferenceById(medId);
            rv.setMedecin(medecinRef);
        }

        rv = rendezVousRepository.save(rv);
        return ResponseEntity.ok(rendezVousDtoMapper.toDto(rv));
    }

    // ------------------- GET RDV by ID -------------------
    @GetMapping("/rendezvous/{id}")
    public ResponseEntity<RendezVousDto> getRendezVous(@PathVariable Long id) {
        RendezVous rv = rendezVousRepository.findById(id).orElse(null);
        if (rv == null) return ResponseEntity.notFound().build();

        // ⚠️ IMPORTANT : ne pas construire un DTO avec des entités (évite proxys)
        // Utiliser le mapper qui renvoie des scalaires (ids/nom/prenom/...)
        RendezVousDto dto = rendezVousDtoMapper.toDto(rv);
        return ResponseEntity.ok(dto);
    }

    // ------------------- LISTE RDV DU PATIENT -------------------
    /*@GetMapping("/rendezvous")
    public ResponseEntity<List<RendezVousDto>> getAllRendezVous() {
        String email = getCurrentUserEmail();

        Long patientId = patientRepository.findIdByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        // Utilise une référence pour la méthode repo qui prend un Patient
        Patient patientRef = patientRepository.getReferenceById(patientId);

        List<RendezVous> rendezVousList = rendezVousRepository.findByPatient(patientRef);
        List<RendezVousDto> dtoList = rendezVousList.stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtoList);
    }*/
    @GetMapping("/rendezvous")
    public ResponseEntity<List<RendezVousDto>> getAllRendezVous() {
        String email = getCurrentUserEmail();
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        List<RendezVous> rendezVousList = rendezVousRepository.findByPatient(patient);
        List<RendezVousDto> dtoList = rendezVousList.stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    // ------------------- HISTORIQUE RDV -------------------
    /*@GetMapping("/rendezvous/historique")
    public ResponseEntity<List<HistoriqueRendezVousDto>> getHistoriqueRendezVous() {
        String email = getCurrentUserEmail();

        Long patientId = patientRepository.findIdByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvable"));
        Patient patientRef = patientRepository.getReferenceById(patientId);

        List<HistoriqueRendezVous> historiqueRendezVousList =
                historiqueRendezVousRepository.findByPatient(patientRef);

        List<HistoriqueRendezVousDto> dtoList = historiqueRendezVousList.stream()
                .map(historiqueRvMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtoList);
    }*/
    @GetMapping("/rendezvous/historique")
    public ResponseEntity<List<HistoriqueRendezVousDto>> getHistoriqueRendezVous() {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvable"));
        List<HistoriqueRendezVous> historiqueRendezVousList = historiqueRendezVousRepository.findByPatient(p);
        List<HistoriqueRendezVousDto> dtoList = historiqueRendezVousList.stream().map(historiqueRvMapper::toDto).toList();
        return ResponseEntity.ok(dtoList);
    }

    // ------------------- RDV CONFIRMÉS -------------------
    @GetMapping("/rendezvous/confirme")
    public ResponseEntity<List<RendezVousDto>> getConfirmedAppointments() {
        String email = getCurrentUserEmail();

        Long patientId = patientRepository.findIdByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvable"));
        Patient patientRef = patientRepository.getReferenceById(patientId);

        StatusRendezVous status = StatusRendezVous.Confirmé; // attention à la casse exacte de ton enum
        List<RendezVous> rendezVousList = rendezVousRepository.findByPatientAndStatus(patientRef, status);

        List<RendezVousDto> dtoList = rendezVousList.stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();

        return ResponseEntity.ok(dtoList);
    }

    // ------------------- DELETE RDV -------------------
    @DeleteMapping("/rendezvous/{id}")
    @Transactional
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        var rvOpt = rendezVousRepository.findById(id);
        if (rvOpt.isEmpty()) return ResponseEntity.notFound().build();

        RendezVous rv = rvOpt.get();

        // Historique le plus récent (si tu as une méthode custom; sinon adapte)
        var list = historiqueRendezVousRepository.findByRvIdOrderByDateCreationDesc(id);
        if (!list.isEmpty()) {
            var hrv = list.get(0);
            hrv.setStatus(StatusRendezVous.Annulé);
            hrv.setDateDAnnulation(LocalDate.now());
            // @Transactional => flush via dirty checking
        }

        // Deux choix : soft-delete (recommandé) OU suppression
        // Soft-delete :
        // rv.setStatus(StatusRendezVous.Annulé);
        // rendezVousRepository.save(rv);

        // Suppression définitive :

        //soft delete
        rv.setStatus(StatusRendezVous.Annulé);
        rendezVousRepository.save(rv);
        //rendezVousRepository.delete(rv);

        return ResponseEntity.noContent().build();
    }

    // ------------------- CHANGE PASSWORD (à sécuriser !) -------------------
    @PostMapping("/{id}/changerMotDePasse")
    public ResponseEntity<Void> changeMotDePasse(@PathVariable Long id,
                                                 @RequestBody ChangePasswordRequest request) {
        String email = getCurrentUserEmail();

        // ⚠️ Ici tu compares les mots de passe en clair : à remplacer par PasswordEncoder
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        if (!p.getId().equals(id)) return new ResponseEntity<>(HttpStatus.FORBIDDEN);

        if (!p.getMotdepasse().equals(request.getOldPassword())) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        p.setMotdepasse(request.getNewPassword());
        // pas besoin d'appeler deux fois setMotdepasse
        patientRepository.save(p);
        return ResponseEntity.noContent().build();
    }

    /*@PostMapping("/changerMotDePasse")
    @Transactional
    public ResponseEntity<?> changeMotDePasse(@Valid @RequestBody ChangePasswordRequest request) {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'email : " + email));

        if (!passwordEncoder.matches(request.getOldPassword(), p.getMotdepasse())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Ancien mot de passe incorrect.");
        }
        if (!request.getNewPassword().equals(request.getConfirmNewPassword())) {
            return ResponseEntity.badRequest().body("La confirmation ne correspond pas.");
        }
        if (request.getNewPassword().length() < 8) {
            return ResponseEntity.badRequest().body("Minimum 8 caractères.");
        }
        if (passwordEncoder.matches(request.getNewPassword(), p.getMotdepasse())) {
            return ResponseEntity.badRequest().body("Le nouveau mot de passe ne doit pas être identique à l'ancien.");
        }

        p.setMotdepasse(passwordEncoder.encode(request.getNewPassword()));
        patientRepository.save(p);
        return ResponseEntity.noContent().build();
    }*/
    @PostMapping("/changerTelephone")
    public ResponseEntity<?> changeTelephone(@Valid @RequestBody ChangePhoneRequest request) {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé: " + email));

        String e164 = PhoneUtil.toE164(request.getPhone(), "MA"); // normaliser
        p.setTelephone(e164);
        patientRepository.save(p);

        return ResponseEntity.noContent().build(); // 204
    }
    /*@PostMapping("/changerEmail")
    @Transactional
    public ResponseEntity<?> changeEmail(@Valid @RequestBody ChangeEmailRequest request) {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé: " + email));
        p.setEmail(request.getNewEmail());
        patientRepository.save(p);

        Jwt access = jwtService.generateAccessToken(
                p.getId(), request.getNewEmail(), p.getCin(), p.getNom(), p.getPrenom(),p.getRole()
        );

        Jwt refresh = jwtService.generateRefreshToken(
                p.getId(), request.getNewEmail(), p.getCin(), p.getNom(), p.getPrenom(), p.getRole()
        );



        return ResponseEntity.ok(Map.of(
                "message", "E‑mail modifié.",
                "accessToken", access,      // toString si ta classe Jwt encapsule .value()
                "refreshToken", refresh
        ));

    }*/
    @PostMapping("/changerEmail")
    @Transactional
    public ResponseEntity<?> changeEmail(@Valid @RequestBody ChangeEmailRequest request) {
        String oldEmail = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(oldEmail)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé: " + oldEmail));

        String newEmail = request.getNewEmail();
        if (newEmail == null || newEmail.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Nouvel e-mail requis."));
        }
        if (newEmail.equalsIgnoreCase(oldEmail)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Le nouvel e-mail doit être différent."));
        }
        if (patientRepository.findByEmail(newEmail).isPresent()) {
            return ResponseEntity.status(409).body(Map.of("message", "E-mail déjà utilisé."));
        }

        // (Optionnel) sécurité : demander le mot de passe courant et le vérifier
        // if (!passwordEncoder.matches(request.getCurrentPassword(), p.getMotdepasse())) {
        //     return ResponseEntity.status(403).body(Map.of("message", "Mot de passe incorrect."));
        // }

        // Mettre à jour l'e-mail
        p.setEmail(newEmail);
        p.setEmailVerifiedAt(null);
        patientRepository.save(p);

        var access  = jwtService.generateAccessToken(
                p.getId(), p.getEmail(), p.getCin(), p.getNom(), p.getPrenom(), p.getRole()
        );
        var refresh = jwtService.generateRefreshToken(
                p.getId(), p.getEmail(), p.getCin(), p.getNom(), p.getPrenom(), p.getRole()
        );

        String accessToken  = access.getToken();   // <-- use this
        String refreshToken = refresh.getToken();

        return ResponseEntity.ok(Map.of(
                "message", "E-mail modifié.",
                "accessToken", accessToken,
                "refreshToken", refreshToken
        ));

    }
    //envoyer code telephone
    /*@PostMapping("/envoyerCodeTelephone")
    public ResponseEntity<?> envoyerCodeTelephone() {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé: " + email));

        if (p.getTelephone() == null || p.getTelephone().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error","Aucun téléphone enregistré"));
        }

        phoneVerifyService.sendCodeSms(p.getTelephone()); // Twilio Verify
        return ResponseEntity.noContent().build();
    }*/
    //verifierTelephone
    /*@PostMapping("/verifierTelephone")
    public ResponseEntity<?> verifierTelephone(@RequestBody VerifyPhoneRequest req) {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé: " + email));

        if (p.getTelephone() == null)
            return ResponseEntity.badRequest().body(Map.of("error","Téléphone manquant"));

        boolean ok = phoneVerifyService.checkCode(p.getTelephone(), req.getCode());
        if (!ok) return ResponseEntity.badRequest().body(Map.of("error","Code invalide ou expiré"));

        p.setTelephoneVerifiedAt(java.time.OffsetDateTime.now());
        patientRepository.save(p);

        return ResponseEntity.ok(Map.of("verified", true, "telephone", p.getTelephone()));
    }*/
    @PostMapping("/changerMotDePasse")
    @Transactional
    public ResponseEntity<?> changeMotDePasse(
            @Valid @RequestBody ChangePasswordRequest req) {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé: " + email));

        // Vérif ancien (401 si faux)
        if (!passwordEncoder.matches(req.getOldPassword(), p.getMotdepasse())) {
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
        } else if (passwordEncoder.matches(req.getNewPassword(), p.getMotdepasse())) {
            reason = "Le nouveau mot de passe ne doit pas être identique à l'ancien.";
        }
        if (reason != null) return ResponseEntity.badRequest().body(reason);

        // OK: encoder + save
        p.setMotdepasse(passwordEncoder.encode(req.getNewPassword()));
        p.setPasswordlength(req.getNewPassword().length());
        // (optionnel) si tu stockes password_length en DB:
        // p.setPasswordLength(req.getNewPassword().length());
        patientRepository.save(p);
        return ResponseEntity.noContent().build();
    }

    /*@Transactional(readOnly = true)
    @GetMapping("/me/photo")
    public ResponseEntity<byte[]> getMyPhoto(Authentication auth) {
        String email = auth.getName(); // ou SecurityContextHolder.getContext().getAuthentication().getName()
        PhotoView p = userRepository.findPhotoByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        HttpHeaders h = new HttpHeaders();
        h.setContentType(MediaType.parseMediaType(
                p.getPhotoContentType() != null ? p.getPhotoContentType() : "application/octet-stream"));
        h.setContentDisposition(ContentDisposition.inline()
                .filename(p.getPhotoFilename() != null ? p.getPhotoFilename() : "photo").build());
        return new ResponseEntity<>(p.getPhotoIdentite(), h, HttpStatus.OK);
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
            return ResponseEntity.notFound().build(); // ou renvoyer une image par défaut
        }

        // user.image est par ex. "/files/profile/abc.jpg"
        String relative = user.getImage().replaceFirst("^/files/", ""); // -> "profile/abc.jpg"
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
        java.nio.file.Path base = root.resolve("patients").resolve("profile").normalize();
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
            String relOld = oldImage.replaceFirst("^/files/", ""); // ex: "patients/profile/abc.jpg"
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
        user.setImage("/files/patients/profile/" + safeName);
        // (optionnel si tu as ces colonnes)
        // user.setPhotoContentType(contentType);
        // user.setPhotoSize(file.getSize());
        // user.setPhotoFilename(safeName);

        userRepository.save(user);

        // Le front continue à consommer /api/Patient/myImage
        return ResponseEntity.ok(Map.of(
                "message", "OK",
                "imageUrl", "/api/Patient/myImage"
        ));
    }


    @GetMapping("/basic-info")
    @Transactional(readOnly = true)
    public ResponseEntity<UserBasicInfo> getBasicInfo() {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + email));
        //password length
        int pwdlen = p.getPasswordlength();
        UserBasicInfo dto = new UserBasicInfo(
                p.getId(),
                p.getNom(),
                p.getPrenom(),
                p.getTelephone(),
                p.getEmail(),
                pwdlen,
                p.getEmailVerifiedAt()
        );
        return ResponseEntity.ok(dto);
    }
    @GetMapping("/infos")
    public ResponseEntity<UserInfoDto> getUserInfo() {
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + email));
        UserInfoDto dto = new UserInfoDto(
                p.getNom(),
                p.getPrenom(),
                p.getCin(),
                p.getAdresse(),
                p.getTelephone(),
                p.getEmail(),
                p.getDatedenaissance(),
                p.getSexe()
        );
        return ResponseEntity.ok(dto);

    }


    private static final Logger log = LoggerFactory.getLogger(PatientController.class);

    // Parser d’heure super tolérant: "H:mm", "HH:mm", "HH:mm:ss"
    private static final DateTimeFormatter FLEX_TIME = new DateTimeFormatterBuilder()
            .parseCaseInsensitive()
            .appendValue(ChronoField.HOUR_OF_DAY, 1, 2, java.time.format.SignStyle.NOT_NEGATIVE)
            .appendLiteral(':')
            .appendValue(ChronoField.MINUTE_OF_HOUR, 2)
            .optionalStart().appendLiteral(':').appendValue(ChronoField.SECOND_OF_MINUTE, 2).optionalEnd()
            .toFormatter();

    /** Accepte "YYYY-MM-DD" ou "dd/MM/yyyy". */
    private static LocalDate parseDateFlexible(String s) {
        try { return LocalDate.parse(s); } // ISO
        catch (Exception ignore) {}
        return LocalDate.parse(s, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }

    /** Renvoie "HH:mm" quelle que soit la forme stockée en DB. Null-safe. */
    private static String normalizeHeure(String raw) {
        if (raw == null || raw.isBlank()) return null;
        try {
            return LocalTime.parse(raw.trim(), FLEX_TIME).format(HHMM); // "HH:mm"
        } catch (Exception e) {
            // ex: "9:0" -> on tente un pad manuel
            String t = raw.trim();
            if (t.length() >= 5) return t.substring(0, 5);
            if (t.matches("^\\d{1}:\\d{2}$")) return "0" + t; // "9:30" -> "09:30"
            return null;
        }
    }

    // inside PatientController
    /*@GetMapping("/availability")
    public AvailabilityResponse availability(
            @RequestParam Long medecinId,
            @RequestParam String date,
            @RequestParam(required = false, defaultValue = "30") int slot
    ) {
        LocalDate d = LocalDate.parse(date);

        // 1) Rules: date-specific first, else weekly
        List<MedecinHoraire> base = medecinHoraireRepository.findByMedecin_IdAndDateSpecific(medecinId, d);
        if (base.isEmpty()) {
            base = medecinHoraireRepository.findByMedecin_IdAndDayOfWeek(medecinId, d.getDayOfWeek());
        }
        if (base.isEmpty()) {
            return new AvailabilityResponse(d.toString(), medecinId, slot, List.of());
        }

        // 2) Generate candidate slots
        if (slot < 5 || slot > 180 || (slot % 5 != 0)) slot = 30;
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {
            LocalTime t = h.getHeureDebut();
            while (!t.plusMinutes(slot).isAfter(h.getHeureFin())) {
                candidates.add(t);
                t = t.plusMinutes(slot);
            }
        }

        // 3) Subtract absences
        List<MedecinAbsence> absences = medecinAbsenceRepository.findByMedecin_IdAndDate(medecinId, d);
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

        // 4) Subtract already booked RDVs
        var booked = rendezVousRepository.findByMedecin_IdAndDateOrderByHeure(medecinId, d);
        Set<String> taken = booked.stream().map(RendezVous::getHeure).collect(Collectors.toSet());

        // 5) Remove past times (no ZoneId)
        LocalDate today = LocalDate.now();
        List<LocalTime> remaining;
        if (d.isBefore(today)) {
            remaining = List.of(); // aucune dispo pour une date passée
        } else if (d.isEqual(today)) {
            LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
            // option: aligner sur la granularité du slot (ex: 30 min)
            int remainder = now.getMinute() % slot;
            if (remainder != 0) {
                now = now.plusMinutes(slot - remainder);
            }
            final LocalTime cutoff = now;
            remaining = candidates.stream()
                    .filter(t -> !t.isBefore(cutoff))
                    .toList();
        } else {
            remaining = candidates;
        }

        List<String> free = remaining.stream()
                .map(HHMM::format)
                .filter(hhmm -> !taken.contains(hhmm))
                .sorted()
                .toList();

        return new AvailabilityResponse(d.toString(), medecinId, slot, free);
    }*/
   /* @GetMapping("/availability")
    public AvailabilityResponse availability(
            @RequestParam Long medecinId,
            @RequestParam String date,
            @RequestParam(required = false, defaultValue = "60") int slot,
            // optionnel: ignorer un RDV (ex: celui qu'on est en train de "reporter")
            @RequestParam(required = false) Long excludeRendezVousId
    ) {
        LocalDate d = LocalDate.parse(date);

        // 1) Horaires: date-spécifique d'abord, sinon hebdomadaire
        List<MedecinHoraire> base = medecinHoraireRepository.findByMedecin_IdAndDateSpecific(medecinId, d);
        if (base.isEmpty()) {
            base = medecinHoraireRepository.findByMedecin_IdAndDayOfWeek(medecinId, d.getDayOfWeek());
        }
        if (base.isEmpty()) {
            return new AvailabilityResponse(d.toString(), medecinId, slot, List.of());
        }

        // 2) Générer les créneaux candidats
        if (slot < 5 || slot > 180 || (slot % 5 != 0)) slot = 30;
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {
            LocalTime t = h.getHeureDebut();
            while (!t.plusMinutes(slot).isAfter(h.getHeureFin())) {
                candidates.add(t);
                t = t.plusMinutes(slot);
            }
        }

        // 3) Retirer les absences
        List<MedecinAbsence> absences = medecinAbsenceRepository.findByMedecin_IdAndDate(medecinId, d);
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

        // 4) Retirer les RDV déjà pris (⚠️ ignorer Annulé + normaliser HH:mm + exclure l'ID courant si fourni)
        Set<String> taken = rendezVousRepository.findByMedecin_IdAndDateOrderByHeure(medecinId, d)
                .stream()
                .filter(rv -> rv.getStatus() != StatusRendezVous.Annulé)                // ignore les annulés
                .filter(rv -> excludeRendezVousId == null || !rv.getId().equals(excludeRendezVousId))
                .map(rv -> {
                    String h = rv.getHeure();  // "HH:mm" ou "HH:mm:ss"
                    if (h == null || h.length() < 5) return null;
                    return h.substring(0, 5);  // normalise => "HH:mm"
                })
                .filter(java.util.Objects::nonNull)
                .collect(Collectors.toSet());

        // 5) Retirer le passé (si aujourd'hui), en calant sur la granularité du slot
        LocalDate today = LocalDate.now();
        List<LocalTime> remaining;
        if (d.isBefore(today)) {
            remaining = List.of();
        } else if (d.isEqual(today)) {
            LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
            int remainder = now.getMinute() % slot;
            if (remainder != 0) now = now.plusMinutes(slot - remainder);
            final LocalTime cutoff = now;
            remaining = candidates.stream()
                    .filter(t -> !t.isBefore(cutoff))
                    .toList();
        } else {
            remaining = candidates;
        }

        // 6) Transformer en "HH:mm" et filtrer contre les créneaux pris
        List<String> free = remaining.stream()
                .map(HHMM::format)                 // "HH:mm"
                .filter(hhmm -> !taken.contains(hhmm))
                .sorted()
                .toList();

        return new AvailabilityResponse(d.toString(), medecinId, slot, free);
    }*/
    @GetMapping("/availab")
    public AvailabilityResponse availability(
            @RequestParam Long medecinId,
            @RequestParam String date,                               // "YYYY-MM-DD" ou "dd/MM/yyyy"
            @RequestParam(required = false, defaultValue = "60") int slot,
            @RequestParam(required = false) Long excludeRendezVousId // optionnel: ignorer le RDV en cours de report
    ) {
        // 0) Date (flex)
        LocalDate d = parseDateFlexible(date);
        log.info("[availability] medecinId={}, date='{}' -> {}, slot={}, excludeId={}",
                medecinId, date, d, slot, excludeRendezVousId);

        // 1) Horaires (date-spécifique puis hebdomadaire)
        List<MedecinHoraire> base = medecinHoraireRepository.findByMedecin_IdAndDateSpecific(medecinId, d);
        if (base.isEmpty()) {
            base = medecinHoraireRepository.findByMedecin_IdAndDayOfWeek(medecinId, d.getDayOfWeek());
        }
        if (base.isEmpty()) {
            log.warn("[availability] Aucun horaire pour medecinId={} le {}", medecinId, d);
            return new AvailabilityResponse(d.toString(), medecinId, slot, List.of());
        }

        // 2) Générer les créneaux candidats
        if (slot < 5 || slot > 180 || (slot % 5 != 0)) slot = 60; // garde-fou cohérent avec default
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {
            LocalTime start = h.getHeureDebut();
            LocalTime end   = h.getHeureFin();
            if (start == null || end == null || !start.isBefore(end)) continue;
            LocalTime t = start;
            while (!t.plusMinutes(slot).isAfter(end)) {
                candidates.add(t);
                t = t.plusMinutes(slot);
            }
        }
        log.info("[availability] candidats={} après horaires", candidates.size());

        // 3) Retirer les absences
        List<MedecinAbsence> absences = medecinAbsenceRepository.findByMedecin_IdAndDate(medecinId, d);
        if (!absences.isEmpty()) {
            candidates = candidates.stream().filter(t -> {
                for (MedecinAbsence a : absences) {
                    LocalTime s = (a.getStartTime() != null) ? a.getStartTime() : LocalTime.MIN;
                    LocalTime e = (a.getEndTime()   != null) ? a.getEndTime()   : LocalTime.MAX;
                    if (!t.isBefore(s) && t.isBefore(e)) return false; // t ∈ [s, e)
                }
                return true;
            }).collect(Collectors.toList());
        }
        log.info("[availability] candidats={} après absences", candidates.size());

        // 4) RDV déjà pris (ignorer Annulé, normaliser HH:mm, exclure l'ID courant si fourni)
        Set<String> taken = rendezVousRepository.findByMedecin_IdAndDateOrderByHeure(medecinId, d)
                .stream()
                .filter(rv -> rv.getStatus() != StatusRendezVous.Annulé)
                .filter(rv -> excludeRendezVousId == null || !rv.getId().equals(excludeRendezVousId))
                .map(rv -> normalizeHeure(rv.getHeure()))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        log.info("[availability] taken={} => {}", taken.size(), taken);

        // 5) Enlever les créneaux passés si aujourd'hui (aligné sur slot)
        List<LocalTime> remaining;
        LocalDate today = LocalDate.now();
        if (d.isBefore(today)) {
            remaining = List.of();
        } else if (d.isEqual(today)) {
            LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
            int rem = now.getMinute() % slot;
            if (rem != 0) now = now.plusMinutes(slot - rem);
            final LocalTime cutoff = now;
            remaining = candidates.stream().filter(t -> !t.isBefore(cutoff)).toList();
        } else {
            remaining = candidates;
        }
        log.info("[availability] remaining={} après filtre 'passé'", remaining.size());

        // 6) Final: "HH:mm" et filtre contre 'taken'
        List<String> free = remaining.stream()
                .map(HHMM::format)
                .filter(hhmm -> !taken.contains(hhmm))
                .sorted()
                .toList();

        log.info("[availability] FREE={} => {}", free.size(), free);
        return new AvailabilityResponse(d.toString(), medecinId, slot, free);
    }

    @GetMapping("/availability")
    public AvailabilityResponse availability(
            @RequestParam Long medecinId,
            @RequestParam String date
    ) {
        LocalDate d = LocalDate.parse(date);

        // 1) Horaires spécifiques d'abord, sinon hebdomadaire
        List<MedecinHoraire> base = medecinHoraireRepository.findByMedecin_IdAndDateSpecific(medecinId, d);
        if (base.isEmpty()) {
            base = medecinHoraireRepository.findByMedecin_IdAndDayOfWeek(medecinId, d.getDayOfWeek());
        }
        if (base.isEmpty()) {
            return new AvailabilityResponse(d.toString(), medecinId, 60, List.of());
        }

        // 2) Slot fixe 60 minutes
        final int finalSlot = 60;

        // 3) Génération des créneaux candidats
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {

            if (h.getHeureDebut() == null || h.getHeureFin() == null) continue;
            if (!h.getHeureDebut().isBefore(h.getHeureFin())) continue;

            LocalTime t = h.getHeureDebut();
            int count = 0;
            int maxSlotsPerHoraire = 24;

            while (!t.plusMinutes(finalSlot).isAfter(h.getHeureFin()) && count < maxSlotsPerHoraire) {
                candidates.add(t);
                t = t.plusMinutes(finalSlot);
                count++;
            }
        }

        // 4) Retirer les absences
        List<MedecinAbsence> absences = medecinAbsenceRepository.findByMedecin_IdAndDate(medecinId, d);
        if (!absences.isEmpty()) {
            candidates = candidates.stream().filter(t -> {
                for (MedecinAbsence a : absences) {
                    LocalTime s = (a.getStartTime() != null) ? a.getStartTime() : LocalTime.MIN;
                    LocalTime e = (a.getEndTime() != null) ? a.getEndTime() : LocalTime.MAX;
                    if (!t.isBefore(s) && t.isBefore(e)) return false;
                }
                return true;
            }).toList();
        }

        // 5) Retirer les rendez-vous déjà pris
        var booked = rendezVousRepository.findByMedecin_IdAndDateOrderByHeure(medecinId, d);
        Set<String> taken = booked.stream().map(RendezVous::getHeure).collect(Collectors.toSet());

        // 6) Retirer les créneaux passés
        LocalDate today = LocalDate.now();
        List<LocalTime> remaining;
        if (d.isBefore(today)) {
            remaining = List.of();
        } else if (d.isEqual(today)) {
            LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
            int remainder = now.getMinute() % finalSlot;
            if (remainder != 0) {
                now = now.plusMinutes(finalSlot - remainder);
            }
            final LocalTime cutoff = now;
            remaining = candidates.stream()
                    .filter(t -> !t.isBefore(cutoff))
                    .toList();
        } else {
            remaining = candidates;
        }

        // 7) Conversion en HH:mm et filtrage final
        List<String> free = remaining.stream()
                .map(HHMM::format)
                .filter(hhmm -> !taken.contains(hhmm))
                .sorted()
                .toList();

        return new AvailabilityResponse(d.toString(), medecinId, finalSlot, free);
    }


    @PutMapping("/delete-account")
    public ResponseEntity deleteAccount(){
        String email = getCurrentUserEmail();
        Patient p = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Patient introuvable"));
        p.setIs_deleted(true);
        patientRepository.save(p);
        return ResponseEntity.ok("Votre compte a été désactivé.");
    }

    @PatchMapping("/update-info-perso")
    @Transactional
    public ResponseEntity<?> updateInfoPerso(
            @Valid @RequestBody UpdatePatientProfileRequest req
    ){
        String email = getCurrentUserEmail();
        Patient patient = patientRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Patient introuvable"));
        // Appliquer uniquement les champs non nuls
        if (req.getNom() != null) patient.setNom(req.getNom().trim());
        if (req.getPrenom() != null) patient.setPrenom(req.getPrenom().trim());
        if (req.getDateNaissance() != null) patient.setDatedenaissance(req.getDateNaissance());
        patient.setNomComplet(req.getPrenom()+ " " + req.getNom());
        if (req.getAdresse() != null) patient.setAdresse(req.getAdresse().trim());
        if (req.getTelephone() != null) patient.setTelephone(req.getTelephone().replaceAll("\\s+", ""));
        if (req.getSexe() != null) patient.setSexe(req.getSexe());
        if (req.getCin() != null) patient.setCin(req.getCin());
        patientRepository.save(patient);

        return ResponseEntity.ok(patient);
    }

    @GetMapping("/searchMedecin")
    public List<MedecinSearchDto> searchMedecin(@RequestParam String q){
        return medecinSearchService.searchMedecin(q);
    }

    @GetMapping("/{medecinId}/getMedecinImage")
    public ResponseEntity<Resource> getMedecinImage(
            @PathVariable Long medecinId,
            Authentication auth,
            @Value("${user.dir}/uploads") String uploadDir) throws Exception{
        if (auth == null) return ResponseEntity.status(401).build();
        var med = userRepository.findById(medecinId)
                .orElseThrow(() -> new RuntimeException("Medecin introuvable"));

        if (med.getImage() == null) {
            return ResponseEntity.notFound().build();
        }

        String relative = med.getImage().replaceFirst("^/files/", "");
        Path file = java.nio.file.Paths.get(uploadDir).resolve(relative).normalize();

        if (!java.nio.file.Files.exists(file)) return ResponseEntity.notFound().build();

        var res = new UrlResource(file.toUri());
        String ct = java.nio.file.Files.probeContentType(file);

        return ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.parseMediaType(ct != null ? ct : "application/octet-stream"))
                .body(res);
    }






}

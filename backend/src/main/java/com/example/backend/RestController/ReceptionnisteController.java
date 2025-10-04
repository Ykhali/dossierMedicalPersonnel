package com.example.backend.RestController;

import ch.qos.logback.classic.Logger;
import com.example.backend.Dao.*;
import com.example.backend.Dto.*;
import com.example.backend.Entity.*;
import com.example.backend.Entity.Enums.StatusRendezVous;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Service.ServiceImpl.AvailabilityServiceImpl;
import com.example.backend.Service.ServiceImpl.PhoneUtil;
import com.example.backend.mapper.MedecinDTOMapper;
import com.example.backend.mapper.PatientDTOMapper;
import com.example.backend.mapper.ReceptionnisteDTOMapper;
import com.example.backend.mapper.RendezVousDtoMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static com.example.backend.config.SecurityUtils.getCurrentUserEmail;

@RestController
@RequestMapping("/api/receptionniste")
@Tag(name = "Receptionniste")
public class ReceptionnisteController {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired private UserRepository userRepository;
    @Autowired
    private PatientDTOMapper patientDTOMapper;
    @Autowired
    private RendezVousRepository rendezVousRepository;
    @Autowired
    private RendezVousDtoMapper rendezVousDtoMapper;
    @Autowired private AvailabilityServiceImpl availabilityService;
    @Autowired
    private ReceptionnisteRepository receptionnisteRepository;
    @Autowired
    private MedecinRepository medecinRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired
    private ReceptionnisteDTOMapper receptionnisteDTOMapper;
    @Autowired
    private HistoriqueRendezVousRepository historiqueRendezVousRepository;
    @Autowired private MedecinDTOMapper medecinDTOMapper;
    @Autowired private MedecinAbsenceRepository medecinAbsenceRepository;
    @Autowired private MedecinHoraireRepository medecinHoraireRepository;

    private static final DateTimeFormatter HHMM = DateTimeFormatter.ofPattern("HH:mm");

    @Value("${app.upload.dir}")
    private String uploadDir;

    //patients
    @GetMapping("/patients")
    @Operation(summary = "Afficher tout les patients")//pour afficher une description dans swagger
    public Iterable<PatientDto> getAllPatients() {
        return patientRepository.findAll()
                .stream()
                .map(patientDTOMapper::toDto)
                .toList();
    }

    @GetMapping("/medecins")
    public Iterable<MedecinDto> getAllMedecins() {
        return medecinRepository.findAll().stream()
                .map(medecinDTOMapper::toDto).toList();
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<PatientDto> getpatient(@PathVariable Long id) {
        var patient = patientRepository.findById(id).orElse(null);
        if(patient == null) {
            //return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            return ResponseEntity.notFound().build();
        }
        //return new ResponseEntity<>(patient, HttpStatus.OK);
        //return ResponseEntity.ok(patient);
        return ResponseEntity.ok(patientDTOMapper.toDto(patient));
    }

    @PostMapping("/patients")
    public ResponseEntity<PatientDto> createPatient(
            @RequestBody AddPatientDto request,
            UriComponentsBuilder uriBuilder) {
        if(!request.getMotdepasse().equals(request.getConfirmpwd())){
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }else{
            var p = patientDTOMapper.toEntity(request);
            p.setRole(Role.PATIENT);
            patientRepository.save(p);

            var patientDto = patientDTOMapper.toDto(p);
            var uri = uriBuilder.path("/patients/{id}").buildAndExpand(patientDto.getId()).toUri();
            return  ResponseEntity.created(uri).body(patientDto);
        }

    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<PatientDto> updatePatient(
            @PathVariable(name = "id") Long id,
            @RequestBody UpdatePatientDto request) {
        var p = patientRepository.findById(id).orElse(null);
        if(p == null) {
            return ResponseEntity.notFound().build();
        }
        patientDTOMapper.update(request, p);
        patientRepository.save(p);
        return ResponseEntity.ok(patientDTOMapper.toDto(p));
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        var p = patientRepository.findById(id).orElse(null);
        if(p == null) {
            return ResponseEntity.notFound().build();
        }
        patientRepository.delete(p);
        return ResponseEntity.noContent().build();
    }

    //RendezVous
    @GetMapping("/rendezVous")
    public Iterable<RendezVousDto> getAllRendezVous() {
        return rendezVousRepository.findAll().stream()
                .map(rv -> new RendezVousDto(
                        rv.getId(),
                        rv.getDate(),
                        rv.getDateCreation(),
                        rv.getHeure(),
                        rv.getMotif(),
                        rv.getMedecin(),
                        rv.getStatus(),
                        rv.getPatient()
                )).toList();
    }

    /*@GetMapping("/rendezVous/aujourdhui")
    public List<RendezVousDto> getRendezVousAujourdhui() {
        LocalDate today = LocalDate.now();
        return rendezVousRepository.findByDateOrderByHeure(today)
                .stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();
    }

    @GetMapping("/rendezVous/avenir")
    public List<RendezVousDto> getAvenir() {
        LocalDate today = LocalDate.now();
        String nowTimeStr = java.time.LocalTime.now()
                .toString()              // "HH:mm:ss.nnn"
                .substring(0,5);         // "HH:mm"
        return rendezVousRepository.findUpcomingAfterNow(today, nowTimeStr)
                .stream().map(rendezVousDtoMapper::toDto).toList();
    }*/

    /** Retourne la liste des IDs des médecins gérés par la réceptionniste. */
    private List<Long> managedMedecinIdsOrEmpty() {
        String email = getCurrentUserEmail();
        Receptionniste rec = receptionnisteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Réceptionniste introuvable: " + email));

        // Adapte selon ton modèle:
        // - Si ManyToOne:
        //   return rec.getMedecin() != null ? List.of(rec.getMedecin().getId()) : List.of();

        // - Si ManyToMany:
        return rec.getMedecins() == null ? List.of()
                : rec.getMedecins().stream().map(Medecin::getId).toList();
    }
    @GetMapping("/rendezVous/aujourdhui")
    public List<RendezVousDto> getRendezVousAujourdhui() {
        List<Long> medIds = managedMedecinIdsOrEmpty();
        if (medIds.isEmpty()) return List.of();

        LocalDate today = LocalDate.now();
        return rendezVousRepository
                .findByMedecin_IdInAndDateOrderByHeureAsc(medIds, today)
                .stream()
                .filter(rdv -> rdv.getStatus() == StatusRendezVous.Planifié)
                .map(rendezVousDtoMapper::toDto)
                .toList();
    }
    @GetMapping("/rendezVous/aujourdhui/annules")
    public List<RendezVousDto> getRendezVousAnnulesAujourdhui() {
        List<Long> medIds = managedMedecinIdsOrEmpty();
        if (medIds.isEmpty()) return List.of();

        LocalDate today = LocalDate.now();
        return rendezVousRepository
                .findByMedecin_IdInAndDateAndStatusOrderByHeureAsc(medIds, today, StatusRendezVous.Annulé)
                .stream()
                .map(rendezVousDtoMapper::toDto)
                .toList();
    }

    /*@GetMapping("/rendezVous/prochain")
    public ResponseEntity<RendezVousDto> getProchainRendezVous() {
        List<Long> medIds = managedMedecinIdsOrEmpty();
        if (medIds.isEmpty()) return ResponseEntity.noContent().build();

        LocalDate today = LocalDate.now();

        // nowStr doit être strictement au format "HH:mm" (ou "HH:mm:ss" selon ton stockage)
        String nowStr = java.time.LocalTime.now()
                .withSecond(0).withNano(0)
                .format(java.time.format.DateTimeFormatter.ofPattern("HH:mm"));

        return rendezVousRepository
                .findFirstByMedecin_IdInAndDateAndHeureGreaterThanEqualOrderByHeureAsc(medIds, today, nowStr)
                .or(() -> rendezVousRepository
                        .findFirstByMedecin_IdInAndDateAfterOrderByDateAscHeureAsc(medIds, today))
                .map(rendezVousDtoMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }*/
    @GetMapping("/rendezVous/prochain")
    public ResponseEntity<RendezVousDto> getProchainRendezVous() {
        List<Long> medIds = managedMedecinIdsOrEmpty();
        if (medIds.isEmpty()) return ResponseEntity.noContent().build();

        LocalDate today = LocalDate.now();

        String nowStr = LocalTime.now()
                .withSecond(0).withNano(0)
                .format(DateTimeFormatter.ofPattern("HH:mm"));

        return rendezVousRepository
                .findFirstByMedecin_IdInAndDateAndHeureGreaterThanEqualAndStatusOrderByHeureAsc(
                        medIds, today, nowStr, StatusRendezVous.Planifié
                )
                .or(() -> rendezVousRepository
                        .findFirstByMedecin_IdInAndDateAfterAndStatusOrderByDateAscHeureAsc(
                                medIds, today, StatusRendezVous.Planifié
                        ))
                .map(rendezVousDtoMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }


    /*@GetMapping("/rendezVous/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        List<Long> medIds = managedMedecinIdsOrEmpty();
        if (medIds.isEmpty()) {
            return ResponseEntity.ok(Map.of("today", 0L, "upcoming", 0L, "cancelled", 0L));
        }

        LocalDate today = LocalDate.now();
        String nowStr = LocalTime.now().withSecond(0).withNano(0)
                .format(DateTimeFormatter.ofPattern("HH:mm"));

        long todayCount = rendezVousRepository.countByMedecin_IdInAndDate(medIds, today);
        long cancelledCount = rendezVousRepository.countByMedecin_IdInAndDateAndStatus(medIds, today, StatusRendezVous.Annulé);
        long upcomingCount = rendezVousRepository.countUpcoming(medIds, today, nowStr);

        Map<String, Long> stats = new HashMap<>();
        stats.put("today", todayCount);
        stats.put("upcoming", upcomingCount);
        stats.put("cancelled", cancelledCount);

        return ResponseEntity.ok(stats);
    }*/
    @GetMapping("/rendezVous/stats")
    public ResponseEntity<Map<String, Long>> getStats() {
        List<Long> medIds = managedMedecinIdsOrEmpty();
        if (medIds.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "today", 0L,
                    "upcoming", 0L,
                    "cancelled", 0L
            ));
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now().withSecond(0).withNano(0);

        // Tous les rendez-vous des médecins gérés (⚠️ peut être lourd si beaucoup de données)
        var allRdv = rendezVousRepository.findAll().stream()
                .filter(r -> medIds.contains(r.getMedecin().getId()))
                .toList();

        // Rendez-vous du jour
        var todayRdv = rendezVousRepository
                .findByMedecin_IdInAndDateOrderByHeureAsc(medIds, today);

        /*long todayCount = todayRdv.stream()
                .filter(r -> r.getStatus() == StatusRendezVous.Planifié)
                .count();*/
        long todayCount = todayRdv.stream()
                .filter(r -> r.getStatus() == StatusRendezVous.Planifié)
                .filter(r -> {
                    LocalTime h = LocalTime.parse(
                            r.getHeure(),
                            DateTimeFormatter.ofPattern("HH:mm") // adapte si "HH:mm:ss"
                    );
                    return !h.isBefore(now); // h >= now
                })
                .count();

        long cancelledCount = todayRdv.stream()
                .filter(r -> r.getStatus() == StatusRendezVous.Annulé)
                .count();

        // Rendez-vous à venir (≥ maintenant aujourd’hui + toutes les dates futures)
        long upcomingCount = allRdv.stream()
                .filter(r -> r.getStatus() == StatusRendezVous.Planifié)
                .filter(r ->
                        (r.getDate().isEqual(today) && !LocalTime.parse(r.getHeure(),
                                DateTimeFormatter.ofPattern("HH:mm")).isBefore(now))
                                || r.getDate().isAfter(today)
                )
                .count();

        Map<String, Long> stats = new HashMap<>();
        stats.put("today", todayCount);
        stats.put("upcoming", upcomingCount);
        stats.put("cancelled", cancelledCount);

        return ResponseEntity.ok(stats);
    }

    @PostMapping("/changePwd")
    @Transactional
    public ResponseEntity<?> changeMotDePasse(
            @Valid @RequestBody ChangePasswordRequest req) {
        String email = getCurrentUserEmail();
        Receptionniste r = receptionnisteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Receptionnist non trouvé: " + email));

        // Vérif ancien (401 si faux)
        if (!passwordEncoder.matches(req.getOldPassword(), r.getMotdepasse())) {
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
        } else if (passwordEncoder.matches(req.getNewPassword(), r.getMotdepasse())) {
            reason = "Le nouveau mot de passe ne doit pas être identique à l'ancien.";
        }
        if (reason != null) return ResponseEntity.badRequest().body(reason);

        // OK: encoder + save
        r.setMotdepasse(passwordEncoder.encode(req.getNewPassword()));
        r.setPasswordlength(req.getNewPassword().length());
        // (optionnel) si tu stockes password_length en DB:
        // p.setPasswordLength(req.getNewPassword().length());
        receptionnisteRepository.save(r);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/changePhone")
    public ResponseEntity<?> changeTelephone(@Valid @RequestBody ChangePhoneRequest request) {
        String email = getCurrentUserEmail();
        Receptionniste r = receptionnisteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Receptionniste non trouvé: " + email));

        String e164 = PhoneUtil.toE164(request.getPhone(), "MA"); // normaliser
        r.setTelephone(e164);
        receptionnisteRepository.save(r);

        return ResponseEntity.noContent().build(); // 204
    }

    @GetMapping("/rendezVous/avenir")
    public List<RendezVousDto> getAvenir() {
        List<Long> medIds = managedMedecinIdsOrEmpty();
        if (medIds.isEmpty()) return List.of();

        LocalDate today = LocalDate.now();
        String nowStr = LocalTime.now().withSecond(0).withNano(0)
                            .toString().substring(0,5); // "HH:mm"
         return rendezVousRepository
             .findUpcomingAfterNowStr(medIds, today, nowStr)
             .stream()
                 .filter(rdv -> rdv.getStatus() == StatusRendezVous.Planifié)
                 .map(rendezVousDtoMapper::toDto).toList();
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
                rv.getPatient());
        return ResponseEntity.ok(rendezVousDto);
    }

    @PostMapping("/rendezVous")
    public ResponseEntity<RendezVousDto> createRendezVous(
            @Valid @RequestBody CreateRendezVousDto request,
            UriComponentsBuilder uriBuilder) {

        var medecin = medecinRepository.findById(request.getMedecinId()).orElse(null);
        var patient = patientRepository.findById(request.getPatientId()).orElse(null);

        if(medecin == null || patient == null) {
            if (medecin == null) {
                System.err.println("Medecin non trouvable");
            }
            if (patient == null) {
                System.err.println("Patient non trouvable");
            }
            return ResponseEntity.badRequest().build();
        }

        var rv =rendezVousDtoMapper.toEntity(request);
        rv.setMedecin(medecin);
        rv.setPatient(patient);
        rv.setStatus(StatusRendezVous.Planifié);
        rv.setDateCreation(LocalDate.now());

        rendezVousRepository.save(rv);

        var historiqueRV = new HistoriqueRendezVous(
                null,
                rv.getId(),
                request.getDate(),
                request.getDateCreation(),
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

    @PutMapping("/rendezVous/{id}/confirmer")
    public ResponseEntity<RendezVousDto> confirmerRendezVous(@PathVariable Long id) {
        RendezVous rv = rendezVousRepository.findById(id).orElse(null);
        if (rv == null) {
            return ResponseEntity.notFound().build();
        }

        rv.setStatus(StatusRendezVous.Confirmé);
        rendezVousRepository.save(rv);
        return ResponseEntity.ok(rendezVousDtoMapper.toDto(rv));
    }

    @GetMapping("/rendezVous/en-attente")
    public List<RendezVousDto> getRendezVousEnAttente() {
        List<RendezVous> rendezVousList = rendezVousRepository.findByStatus(StatusRendezVous.En_attente);

        return rendezVousList.stream()
                .map(rendezVousDtoMapper::toDto)
                .collect(Collectors.toList());
    }




    @PutMapping("/rendezVous/{id}")
    public ResponseEntity<RendezVousDto> updateRendezVous(
            @PathVariable Long id,
            @RequestBody UpdateRendezVousDto request){
        var rv = rendezVousRepository.findById(id).orElse(null);
        if(rv == null) {
            return ResponseEntity.notFound().build();
        }
        rendezVousDtoMapper.update(request,rv);
        rendezVousRepository.save(rv);
        return ResponseEntity.ok(rendezVousDtoMapper.toDto(rv));
    }

    @DeleteMapping("/rendezVous/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        var rv = rendezVousRepository.findById(id).orElse(null);
        if(rv == null) {
            return ResponseEntity.notFound().build();
        }
        rendezVousRepository.delete(rv);
        System.out.println("Rendez Vous Supprimé!!!");
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/historiqueRendezVous")
    public Iterable<HistoriqueRendezVous> getAllHistoriqueRV() {
        return null;
    }

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
    /*@GetMapping("/availability")
    public AvailabilityResponse availability(
            @RequestParam Long medecinId,
            @RequestParam String date,
            @RequestParam(required = false, defaultValue = "30") int slot
    ) {
        LocalDate d = LocalDate.parse(date);

        // 1) Récupérer les horaires : spécifiques à la date ou hebdomadaires
        List<MedecinHoraire> horaires = medecinHoraireRepository.findByMedecin_IdAndDateSpecific(medecinId, d);
        if (horaires.isEmpty()) {
            horaires = medecinHoraireRepository.findByMedecin_IdAndDayOfWeek(medecinId, d.getDayOfWeek());
        }
        if (horaires.isEmpty()) {
            return new AvailabilityResponse(d.toString(), medecinId, slot, List.of());
        }

        // 2) Vérification slot
        if (slot < 5 || slot > 180 || (slot % 5 != 0)) slot = 30;

        // 3) Récupérer absences et rendez-vous déjà pris
        List<MedecinAbsence> absences = medecinAbsenceRepository.findByMedecin_IdAndDate(medecinId, d);
        Set<String> taken = rendezVousRepository.findByMedecin_IdAndDateOrderByHeure(medecinId, d)
                .stream()
                .map(RendezVous::getHeure)
                .collect(Collectors.toSet());

        LocalDate today = LocalDate.now();
        /*LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        int remainder = now.getMinute() % slot;
        if (remainder != 0) now = now.plusMinutes(slot - remainder);
        final LocalTime cutoff = now;*/
        /*final int effectiveSlot = (slot < 5 || slot > 180 || (slot % 5 != 0)) ? 30 : slot;

        LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
        int remainder = now.getMinute() % effectiveSlot;
        if (remainder != 0) now = now.plusMinutes(effectiveSlot - remainder);
        final LocalTime cutoff = now;


        // 4) Génération et filtrage des créneaux en flux (pas de listes intermédiaires énormes)
        int finalSlot = slot;
        List<String> free = horaires.stream()
                .flatMap(h -> {
                    LocalTime t = h.getHeureDebut();
                    Stream.Builder<String> builder = Stream.builder();
                    while (!t.plusMinutes(finalSlot).isAfter(h.getHeureFin())) {
                        builder.add(HHMM.format(t));
                        t = t.plusMinutes(finalSlot);
                    }
                    return builder.build();
                })
                .filter(hhmm -> {
                    LocalTime t = LocalTime.parse(hhmm);
                    // Filtrer créneaux passés
                    if ((d.isBefore(today)) || (d.isEqual(today) && t.isBefore(cutoff))) return false;

                    // Filtrer absences
                    for (MedecinAbsence a : absences) {
                        LocalTime s = (a.getStartTime() != null ? a.getStartTime() : LocalTime.MIN);
                        LocalTime e = (a.getEndTime() != null ? a.getEndTime() : LocalTime.MAX);
                        if (!t.isBefore(s) && t.isBefore(e)) return false;
                    }

                    // Filtrer déjà pris
                    return !taken.contains(hhmm);
                })
                .sorted()
                .toList();

        return new AvailabilityResponse(d.toString(), medecinId, slot, free);
    }*/

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

        // 2) Normalize slot and make final for lambda usage
        if (slot < 5 || slot > 180 || (slot % 5 != 0)) slot = 30;
        final int finalSlot = slot;

        // 3) Generate candidate slots
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {
            LocalTime t = h.getHeureDebut();
            while (!t.plusMinutes(finalSlot).isAfter(h.getHeureFin())) {
                candidates.add(t);
                t = t.plusMinutes(finalSlot);
            }
        }
        for (MedecinHoraire h : base) {
            if (h.getHeureDebut() == null || h.getHeureFin() == null) continue;
            if (!h.getHeureDebut().isBefore(h.getHeureFin())) {
                // ignorer ou logger les horaires invalides
                Logger log = null;
                log.warn("Horaire invalide pour médecin {}: {} - {}", medecinId, h.getHeureDebut(), h.getHeureFin());
                continue;
            }

            LocalTime t = h.getHeureDebut();
            while (!t.plusMinutes(finalSlot).isAfter(h.getHeureFin())) {
                candidates.add(t);
                t = t.plusMinutes(finalSlot);
            }
        }


        // 4) Subtract absences
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

        // 5) Subtract already booked RDVs
        var booked = rendezVousRepository.findByMedecin_IdAndDateOrderByHeure(medecinId, d);
        Set<String> taken = booked.stream().map(RendezVous::getHeure).collect(Collectors.toSet());

        // 6) Remove past times (no ZoneId)
        LocalDate today = LocalDate.now();
        List<LocalTime> remaining;
        if (d.isBefore(today)) {
            remaining = List.of(); // aucune dispo pour une date passée
        } else if (d.isEqual(today)) {
            LocalTime now = LocalTime.now().truncatedTo(ChronoUnit.MINUTES);
            // aligner sur la granularité du slot
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

        List<String> free = remaining.stream()
                .map(HHMM::format)
                .filter(hhmm -> !taken.contains(hhmm))
                .sorted()
                .toList();

        return new AvailabilityResponse(d.toString(), medecinId, finalSlot, free);
    }*/

   /* @GetMapping("/availability")
    public AvailabilityResponse availability(
            @RequestParam Long medecinId,
            @RequestParam String date
    ) {
        LocalDate d = LocalDate.parse(date);

        // 1) Rules: date-specific first, else weekly
        List<MedecinHoraire> base = medecinHoraireRepository.findByMedecin_IdAndDateSpecific(medecinId, d);
        if (base.isEmpty()) {
            base = medecinHoraireRepository.findByMedecin_IdAndDayOfWeek(medecinId, d.getDayOfWeek());
        }
        if (base.isEmpty()) {
            return new AvailabilityResponse(d.toString(), medecinId, 60, List.of());
        }

        // 2) Fix slot to 60 minutes
        final int finalSlot = 60;
        LocalTime debut = LocalTime.of(8,0);
        LocalTime fin = LocalTime.of(8,0); // ou mal saisi
        int slot = 60;

        // 3) Generate candidate slots
        List<LocalTime> candidates = new ArrayList<>();
        for (MedecinHoraire h : base) {
            if (h.getHeureDebut() == null || h.getHeureFin() == null) continue;
            if (!h.getHeureDebut().isBefore(h.getHeureFin())) continue; // sécurité

            LocalTime t = h.getHeureDebut();
            while (!t.plusMinutes(finalSlot).isAfter(h.getHeureFin())) {
                candidates.add(t);
                t = t.plusMinutes(finalSlot);
            }
        }

        // 4) Subtract absences
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

        // 5) Subtract already booked RDVs
        var booked = rendezVousRepository.findByMedecin_IdAndDateOrderByHeure(medecinId, d);
        Set<String> taken = booked.stream().map(RendezVous::getHeure).collect(Collectors.toSet());

        // 6) Remove past times
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

        List<String> free = remaining.stream()
                .map(HHMM::format)
                .filter(hhmm -> !taken.contains(hhmm))
                .sorted()
                .toList();

        return new AvailabilityResponse(d.toString(), medecinId, finalSlot, free);
    }*/

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





    @GetMapping("/listPatients")
    public Iterable<PatientDto> getPatients() {
        return patientRepository.findByDeletedFalse()
                .stream()
                .map(patientDTOMapper::toDto).toList();
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
        Path file = Paths.get(uploadDir).resolve(relative).normalize();

        if (!Files.exists(file)) return ResponseEntity.notFound().build();


        var res = new UrlResource(file.toUri());
        String ct = Files.probeContentType(file); //content type (image type)

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(ct != null ? ct : "application/octet-stream"))
                .body(res);
    }

    @GetMapping("/mes-medecins")
    public Iterable<MedecinDto> getMedecins() {
        String email = getCurrentUserEmail();
        Receptionniste r = receptionnisteRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("Receptionniste non trouvé: " + email));

        return r.getMedecins().stream()
                .map(medecinDTOMapper::toDto)
                .toList();
    }

    //Vérifie que la réceptionniste connectée gère ce médecin, sinon 403.
    private void assertReceptionnisteManages(Long medecinId) {
        String email = getCurrentUserEmail();
        boolean allowed = medecinRepository.existsByIdAndReceptionnistes_Email(medecinId, email);
        if (!allowed) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "Accès refusé : ce médecin n'est pas assigné à cette réceptionniste.");
        }
    }

    @GetMapping("/mes-medecins/{id}/absences")
    public List<MedecinAbsence> listAbsences(@PathVariable("id") Long medecinId) {
        assertReceptionnisteManages(medecinId);
        return medecinAbsenceRepository.findByMedecin_Id(medecinId);
    }
    @GetMapping("/mes-medecins/{id}/horaires")
    public List<MedecinHoraire> listHoraires(@PathVariable("id") Long medecinId) {
        assertReceptionnisteManages(medecinId);
        return medecinHoraireRepository.findByMedecin_IdOrderByDayOfWeekAsc(medecinId);
    }

    /*@GetMapping("/medecins/{medecinId}/availability")
    public ResponseEntity<AvailabilityResponse> getMedecinAvailability(
            @PathVariable Long medecinId,
            @RequestParam String date,
            @RequestParam(required = false, defaultValue = "30") int slot
    ) {
        var d = java.time.LocalDate.parse(date);
        return ResponseEntity.ok(availabilityService.getAvailability(medecinId, d, slot));
    }*/

    @GetMapping("/medecins/{medecinId}/availability")
    public ResponseEntity<AvailabilityResponse> getAvailabilityForMedecin(
            @PathVariable Long medecinId,
            @RequestParam String date,
            @RequestParam(defaultValue = "30") int slot
    ) {
        // sécurité: décommente si tu veux restreindre l'accès
        // assertReceptionnisteManages(medecinId, currentEmail());

        LocalDate d = LocalDate.parse(date);
        var payload = availabilityService.getAvailability(medecinId, d, slot);
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/basic-info")
    @Transactional(readOnly = true)
    public ResponseEntity<BasicInfoDto> getBasicInfo() {
        String email = getCurrentUserEmail();
        Receptionniste r = receptionnisteRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé: " + email));
        int pwdlen = r.getPasswordlength();
        BasicInfoDto dto = new BasicInfoDto(
                r.getId(),
                r.getCin(),
                r.getNom(),
                r.getPrenom(),
                r.getTelephone(),
                r.getEmail(),
                pwdlen

        );
        return ResponseEntity.ok(dto);
    }




}

package com.example.backend.RestController;

import com.example.backend.Dao.*;
import com.example.backend.Dto.*;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.Medecin;
import com.example.backend.Entity.Receptionniste;
import com.example.backend.Service.Iservice.MedecinService;
import com.example.backend.Service.Iservice.PatientService;
import com.example.backend.Service.Iservice.ReceptionnisteService;
import com.example.backend.Service.ServiceImpl.AssignmentService;
import com.example.backend.Service.ServiceImpl.UserService;
import com.example.backend.mapper.MedecinDTOMapper;
import com.example.backend.mapper.PatientDTOMapper;
import com.example.backend.mapper.ReceptionnisteDTOMapper;
import com.example.backend.mapper.UserDtoMapper;
import jakarta.validation.Valid;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private ReceptionnisteRepository receptionnisteRepository;
    @Autowired
    private ReceptionnisteDTOMapper receptionnisteDTOMapper;
    @Autowired
    private MedecinRepository medecinRepository;
    @Autowired
    private MedecinDTOMapper medecinDTOMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private PatientDTOMapper patientDTOMapper;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserDtoMapper userDtoMapper;
    @Autowired
    private RendezVousRepository rendezVousRepository;
    @Autowired
    private HistoriqueRendezVousRepository historiqueRendezVousRepository;
    @Autowired private UserService userService;
    @Autowired private AssignmentService assignmentService;

    @GetMapping("/hello")
    public String sayHello() {
        return "Hello Admin";
    }

    //patients
    @GetMapping("/patients")
    public Iterable<PatientDto> getAllPatients() {
        return patientRepository.findByDeletedFalse()
                .stream()
                .map(patientDTOMapper::toDto)
                .toList();
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
    public ResponseEntity<?> createPatient(//added the question mark to make this function more flexible
            @Valid @RequestBody AddPatientDto request,
            UriComponentsBuilder uriBuilder) {
        if(!request.getMotdepasse().equals(request.getConfirmpwd())){
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }else{
            if (patientRepository.existsByEmail(request.getEmail())){
                return ResponseEntity.badRequest().body(
                        Map.of("email","Email est déjà enregistré")
                );
            }
            var p = patientDTOMapper.toEntity(request);
            p.setRole(Role.PATIENT);
            p.setMotdepasse(passwordEncoder.encode(p.getMotdepasse()));
            p.setPasswordlength(request.getMotdepasse().length());
            p.setNomComplet(request.getNom() + " " + request.getPrenom());
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
        p.setIs_deleted(true);

        patientRepository.save(p);


        return ResponseEntity.noContent().build();
    }

    @PostMapping("patients/{id}/changerMotDePasse")
    public ResponseEntity<Void> changeMotDePasse(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {
        var p = patientRepository.findById(id).orElse(null);
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
    }
    //medecins
    @GetMapping("/medecins")
    public Iterable<MedecinDto> getAllMedecins() {
        return medecinRepository.findAll().stream()
                .map(medecinDTOMapper::toDto).toList();
    }

    @GetMapping("/medecins/{id}")
    public ResponseEntity<MedecinDto> getMedecin(@PathVariable Long id) {
        var m = medecinRepository.findById(id).orElse(null);
        if(m == null) {
            //return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            return ResponseEntity.notFound().build();
        }
        //return new ResponseEntity<>(patient, HttpStatus.OK);
        //return ResponseEntity.ok(patient);
        return ResponseEntity.ok(medecinDTOMapper.toDto(m));
    }

    @PostMapping("/medecins")
    public ResponseEntity<MedecinDto> createMedecin(
            @Valid @RequestBody AddMedecinDto request,
            UriComponentsBuilder uriBuilder) {
        if(!request.getMotdepasse().equals(request.getConfirmpwd())){
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }else{
            var m = medecinDTOMapper.toEntity(request);
            m.setRole(Role.MEDECIN);
            m.setMotdepasse(passwordEncoder.encode(m.getMotdepasse()));
            m.setPasswordlength(request.getMotdepasse().length());
            m.setNomComplet(request.getNom() + " " + request.getPrenom());

            medecinRepository.save(m);
            var medecinDto = medecinDTOMapper.toDto(m);
            var uri = uriBuilder.path("/medecins/{id}").buildAndExpand(medecinDto.getId()).toUri();
            return  ResponseEntity.created(uri).body(medecinDto);
        }
    }

    @PutMapping("/medecins/{id}")//methode pour modifier un medecin
    public ResponseEntity<MedecinDto> updateMedecin(
            @PathVariable(name = "id") Long id,
            @RequestBody UpdateMedecinDto request) {
        var m = medecinRepository.findById(id).orElse(null);
        if(m == null) {
            return ResponseEntity.notFound().build();
        }
        medecinDTOMapper.update(request, m);
        medecinRepository.save(m);
        return ResponseEntity.ok(medecinDTOMapper.toDto(m));
    }

    @DeleteMapping("/medecins/{id}")//methode pour supprimer un medecin
    public ResponseEntity<Void> deleteMedecin(@PathVariable Long id) {
        var m = medecinRepository.findById(id).orElse(null);
        if(m == null) {
            return ResponseEntity.notFound().build();
        }
        m.setIs_deleted(true);
        medecinRepository.save(m);
        return ResponseEntity.noContent().build();
    }

    //Receptionnistes
    @GetMapping("/receptionnistes")
    public Iterable<ReceptionnisteDto> getAllReceptionnistes() {
        return receptionnisteRepository.findAll().stream()
                .map(receptionnisteDTOMapper::toDto).toList();
    }

    @GetMapping("/receptionnistes/{id}")
    public ResponseEntity<ReceptionnisteDto> getReceptionniste(@PathVariable Long id) {
        var R = receptionnisteRepository.findById(id).orElse(null);
        if(R == null) {
            //return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            return ResponseEntity.notFound().build();
        }
        //return new ResponseEntity<>(patient, HttpStatus.OK);
        //return ResponseEntity.ok(patient);
        return ResponseEntity.ok(receptionnisteDTOMapper.toDto(R));
    }

    @PostMapping("/receptionnistes")
    public ResponseEntity<ReceptionnisteDto> createReceptionniste(
            @RequestBody AddReceptionnisteDto request,
            UriComponentsBuilder uriBuilder) {
        if(!request.getMotdepasse().equals(request.getConfirmpwd())){
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }else{
            var R = receptionnisteDTOMapper.toEntity(request);
            R.setRole(Role.RECEPTIONNISTE);
            R.setMotdepasse(passwordEncoder.encode(R.getMotdepasse()));
            R.setPasswordlength(request.getMotdepasse().length());
            R.setNomComplet(request.getNom() + " " + request.getPrenom());
            receptionnisteRepository.save(R);
            var receptionnisteDto = receptionnisteDTOMapper.toDto(R);
            var uri = uriBuilder.path("/receptionnistes/{id}").buildAndExpand(receptionnisteDto.getId()).toUri();
            return  ResponseEntity.created(uri).body(receptionnisteDto);
        }
    }

    @PutMapping("/receptionnistes/{id}")
    public ResponseEntity<ReceptionnisteDto> updateReceptionniste(
            @PathVariable(name = "id") Long id,
            @RequestBody UpdateReceptionnisteDto request) {
        var R = receptionnisteRepository.findById(id).orElse(null);
        if(R == null) {
            return ResponseEntity.notFound().build();
        }
        receptionnisteDTOMapper.update(request, R);
        receptionnisteRepository.save(R);
        return ResponseEntity.ok(receptionnisteDTOMapper.toDto(R));
    }

    @DeleteMapping("/receptionnistes/{id}")
    public ResponseEntity<Void> deleteReceptionniste(@PathVariable Long id) {
        var R = receptionnisteRepository.findById(id).orElse(null);
        if(R == null) {
            return ResponseEntity.notFound().build();
        }
        R.setIs_deleted(true);
        receptionnisteRepository.save(R);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/users")
    public Iterable<UserDto> getAllActiveUsers() {
        return userRepository.findByDeletedFalse().stream()
                .map(userDtoMapper::toDto).toList();
    }

    @GetMapping("/deletedUsers")
    public Iterable<UserDto> getDeletedUsers() {
        return userRepository.findByDeletedTrue().stream()
                .map(userDtoMapper::toDto).toList();
    }
    @GetMapping("/deletedPatients")
    public Iterable<PatientDto> getAllDeletedPatients() {
        return patientRepository.findByDeletedTrue().stream()
                .map(patientDTOMapper::toDto).toList();
    }
    @GetMapping("/deletedMedecins")
    public Iterable<MedecinDto> getAllDeletedMedecins() {
        return medecinRepository.findByDeletedTrue().stream()
                .map(medecinDTOMapper::toDto).toList();
    }
    @GetMapping("/deletedReceptionniste")
    public Iterable<ReceptionnisteDto> getAllDeletedReceptionnistes() {
        return receptionnisteRepository.findByDeletedTrue().stream()
                .map(receptionnisteDTOMapper::toDto).toList();
    }

    /*@PostMapping("/users/{id}/reactivate")
    @Transactional
    public ResponseEntity<?> reactivateUser(@PathVariable Long id) {
        var user = userRepository.findByIdAndDeletedTrue(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found or not marked as deleted.");
        }
        user.setIs_deleted(false);
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }*/
    @PostMapping("/users/{id}/reactivate")
    public ResponseEntity<?> reactivate(@PathVariable Long id) {
        userService.reactivateUser(id);
        return ResponseEntity.ok().build();
    }

    /*
    @PutMapping("/assign/medecins/{medecinId}/receptionnistes")

    public ResponseEntity<Medecin> setReceptionnistes(
            @PathVariable Long medecinId,
            @RequestBody IdsPayload payload
    ) {
        Medecin m = assignmentService.setReceptionnistesForMedecin(medecinId, payload.getIds());
        return ResponseEntity.ok(m);
    }
    @PostMapping("/assign/medecins/{medecinId}/receptionnistes")
    public ResponseEntity<Medecin> addReceptionnistes(
            @PathVariable Long medecinId,
            @RequestBody IdsPayload payload
    ) {
        Medecin m = assignmentService.addReceptionnistesToMedecin(medecinId, payload.getIds());
        return ResponseEntity.ok(m);
    }

    @DeleteMapping("/assign/medecins/{medecinId}/receptionnistes/{receptionnisteId}")
    public ResponseEntity<Medecin> removeReceptionniste(
            @PathVariable Long medecinId,
            @PathVariable Long receptionnisteId
    ) {
        Medecin m = assignmentService.removeReceptionnisteFromMedecin(medecinId, receptionnisteId);
        return ResponseEntity.ok(m);
    }

    @GetMapping("/assign/medecins/{medecinId}/receptionnistes")
    public Set<Receptionniste> listReceptionnistes(@PathVariable Long medecinId) {
        return assignmentService.getReceptionnistesOfMedecin(medecinId);
    }

    @PutMapping("/assign/receptionnistes/{recepId}/medecins")
    public ResponseEntity<Receptionniste> setMedecins(
            @PathVariable Long recepId,
            @RequestBody IdsPayload payload
    ) {
        Receptionniste r = assignmentService.setMedecinsForReceptionniste(recepId, payload.getIds());
        return ResponseEntity.ok(r);
    }

    @Data
    public static class IdsPayload {
        private List<Long> ids;
    }*/
    /* ---------- DTOs simples ---------- */
    public record IdsDTO(List<Long> ids) {}
    public record MedecinWithRecepsDTO(Long medecinId, List<Long> receptionnisteIds) {}
    public record RecepWithMedecinsDTO(Long receptionnisteId, List<Long> medecinIds) {}

    /* ====== Médecin → Réceptionnistes ====== */

    /** Remplace la liste des réceptionnistes d’un médecin */
    @PostMapping("/assign/medecins/{medecinId}/receptionnistes/set")
    public ResponseEntity<MedecinWithRecepsDTO> setReceptionnistesForMedecin(
            @PathVariable Long medecinId,
            @RequestBody IdsDTO body
    ) {
        Medecin m = assignmentService.setReceptionnistesForMedecin(medecinId, body.ids());
        List<Long> recepIds = m.getReceptionnistes().stream().map(Receptionniste::getId).toList();
        return ResponseEntity.ok(new MedecinWithRecepsDTO(m.getId(), recepIds));
    }

    /** Ajoute des réceptionnistes à un médecin (sans remplacer) */
    @PatchMapping("/assign/medecins/{medecinId}/receptionnistes/add")
    public ResponseEntity<MedecinWithRecepsDTO> addReceptionnistesToMedecin(
            @PathVariable Long medecinId,
            @RequestBody IdsDTO body
    ) {
        Medecin m = assignmentService.addReceptionnistesToMedecin(medecinId, body.ids());
        List<Long> recepIds = m.getReceptionnistes().stream().map(Receptionniste::getId).toList();
        return ResponseEntity.ok(new MedecinWithRecepsDTO(m.getId(), recepIds));
    }

    /** Retire une réceptionniste d’un médecin */
    @DeleteMapping("/assign/medecins/{medecinId}/receptionnistes/{recepId}")
    public ResponseEntity<MedecinWithRecepsDTO> removeReceptionnisteFromMedecin(
            @PathVariable Long medecinId,
            @PathVariable Long recepId
    ) {
        Medecin m = assignmentService.removeReceptionnisteFromMedecin(medecinId, recepId);
        List<Long> recepIds = m.getReceptionnistes().stream().map(Receptionniste::getId).toList();
        return ResponseEntity.ok(new MedecinWithRecepsDTO(m.getId(), recepIds));
    }

    /* ====== Réceptionniste → Médecins ====== */

    /** Remplace la liste des médecins d’une réceptionniste */
    @PostMapping("/assign/receptionnistes/{recepId}/medecins/set")
    public ResponseEntity<RecepWithMedecinsDTO> setMedecinsForReceptionniste(
            @PathVariable Long recepId,
            @RequestBody IdsDTO body
    ) {
        var r = assignmentService.setMedecinsForReceptionniste(recepId, body.ids());
        List<Long> medIds = r.getMedecins().stream().map(Medecin::getId).toList();
        return ResponseEntity.ok(new RecepWithMedecinsDTO(r.getId(), medIds));
    }

    /** Ajoute des médecins à une réceptionniste (sans remplacer) */
    @PatchMapping("/assign/receptionnistes/{recepId}/medecins/add")
    public ResponseEntity<RecepWithMedecinsDTO> addMedecinsToReceptionniste(
            @PathVariable Long recepId,
            @RequestBody IdsDTO body
    ) {
        var r = assignmentService.addMedecinsToReceptionniste(recepId, body.ids());
        List<Long> medIds = r.getMedecins().stream().map(Medecin::getId).toList();
        return ResponseEntity.ok(new RecepWithMedecinsDTO(r.getId(), medIds));
    }

    /** Retire un médecin d’une réceptionniste */
    @DeleteMapping("/assign/receptionnistes/{recepId}/medecins/{medecinId}")
    public ResponseEntity<RecepWithMedecinsDTO> removeMedecinFromReceptionniste(
            @PathVariable Long recepId,
            @PathVariable Long medecinId
    ) {
        var r = assignmentService.removeMedecinFromReceptionniste(recepId, medecinId);
        List<Long> medIds = r.getMedecins().stream().map(Medecin::getId).toList();
        return ResponseEntity.ok(new RecepWithMedecinsDTO(r.getId(), medIds));
    }

    /* ===== Récupérations (ids existants) ===== */

    @Transactional(readOnly = true)
    @GetMapping("/assign/receptionnistes/{recepId}/medecins")
    public ResponseEntity<List<Long>> getMedecinsOfReceptionniste(@PathVariable Long recepId) {
        var r = receptionnisteRepository.findByIdWithMedecins(recepId).orElse(null);
        if (r == null) return ResponseEntity.notFound().build();
        var ids = r.getMedecins().stream().map(Medecin::getId).toList();
        return ResponseEntity.ok(ids);
    }

    @Transactional(readOnly = true)
    @GetMapping("/assign/medecins/{medecinId}/receptionnistes")
    public ResponseEntity<List<Long>> getReceptionnistesOfMedecin(@PathVariable Long medecinId) {
        var m = medecinRepository.findByIdWithReceptionnistes(medecinId).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();
        var ids = m.getReceptionnistes().stream().map(Receptionniste::getId).toList();
        return ResponseEntity.ok(ids);
    }

    // AdminController.java
    @GetMapping("/assign/medecins/{medecinId}/receptionnistes/full")
    @Transactional(readOnly = true)
    public ResponseEntity<List<ReceptionnisteDto>> getReceptionnistesOfMedecinFull(
            @PathVariable Long medecinId
    ) {
        var m = medecinRepository.findByIdWithReceptionnistes(medecinId).orElse(null);
        if (m == null) return ResponseEntity.notFound().build();

        var list = m.getReceptionnistes()
                .stream()
                .map(receptionnisteDTOMapper::toDto)
                .toList();

        return ResponseEntity.ok(list);
    }



}

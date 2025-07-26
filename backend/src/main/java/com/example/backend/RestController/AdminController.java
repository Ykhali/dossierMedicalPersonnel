package com.example.backend.RestController;

import com.example.backend.Dao.MedecinRepository;
import com.example.backend.Dao.PatientRepository;
import com.example.backend.Dao.ReceptionnisteRepository;
import com.example.backend.Dto.*;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Service.Iservice.MedecinService;
import com.example.backend.Service.Iservice.PatientService;
import com.example.backend.Service.Iservice.ReceptionnisteService;
import com.example.backend.mapper.MedecinDTOMapper;
import com.example.backend.mapper.PatientDTOMapper;
import com.example.backend.mapper.ReceptionnisteDTOMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private PatientService patientService;
    @Autowired
    private MedecinService medecinService;
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

    //patients
    @GetMapping("/patients")
    public Iterable<PatientDto> getAllPatients() {
        return patientRepository.findAll()
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
        if(!request.getMotDePasse().equals(request.getConfirmPwd())){
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }else{
            if (patientRepository.existsByEmail(request.getEmail())){
                return ResponseEntity.badRequest().body(
                        Map.of("email","Email est déjà enregistré")
                );
            }
            var p = patientDTOMapper.toEntity(request);
            p.setRole(Role.PATIENT);
            p.setMotDePasse(passwordEncoder.encode(p.getMotDePasse()));
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

    @PostMapping("patients/{id}/changerMotDePasse")
    public ResponseEntity<Void> changeMotDePasse(
            @PathVariable Long id,
            @RequestBody ChangePasswordRequest request) {
        var p = patientRepository.findById(id).orElse(null);
        if(p == null) {
            return ResponseEntity.notFound().build();
        }
        if(!p.getMotDePasse().equals(request.getOldPassword())){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        if(!request.getNewPassword().equals(request.getConfirmNewPassword())){
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }else{
            p.setMotDePasse(request.getNewPassword());
            p.setConfirmPwd(request.getConfirmNewPassword());
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
            @RequestBody AddMedecinDto request,
            UriComponentsBuilder uriBuilder) {
        if(!request.getMotDePasse().equals(request.getConfirmPwd())){
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }else{
            var m = medecinDTOMapper.toEntity(request);
            m.setRole(Role.MEDECIN);
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
        medecinRepository.delete(m);
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
        if(!request.getMotDePasse().equals(request.getConfirmPwd())){
            throw new IllegalArgumentException("Les mots de passe ne correspondent pas.");
        }else{
            var R = receptionnisteDTOMapper.toEntity(request);
            R.setRole(Role.RECEPTIONNISTE);
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
        receptionnisteRepository.delete(R);
        return ResponseEntity.noContent().build();
    }


}

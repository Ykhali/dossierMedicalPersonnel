package com.example.backend.RestController;

import com.example.backend.Dao.*;
import com.example.backend.Dto.*;
import com.example.backend.Entity.Enums.StatusRendezVous;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.HistoriqueRendezVous;
import com.example.backend.mapper.PatientDTOMapper;
import com.example.backend.mapper.ReceptionnisteDTOMapper;
import com.example.backend.mapper.RendezVousDtoMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/receptionnistes")
@Tag(name = "Receptionniste")
public class ReceptionnisteController {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private PatientDTOMapper patientDTOMapper;
    @Autowired
    private RendezVousRepository rendezVousRepository;
    @Autowired
    private RendezVousDtoMapper rendezVousDtoMapper;
    @Autowired
    private ReceptionnisteRepository receptionnisteRepository;
    @Autowired
    private MedecinRepository medecinRepository;
    @Autowired
    private ReceptionnisteDTOMapper receptionnisteDTOMapper;
    @Autowired
    private HistoriqueRendezVousRepository historiqueRendezVousRepository;


    //patients
    @GetMapping("/patients")
    @Operation(summary = "Afficher tout les patients")//pour afficher une description dans swagger
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
    public ResponseEntity<PatientDto> createPatient(
            @RequestBody AddPatientDto request,
            UriComponentsBuilder uriBuilder) {
        if(!request.getMotDePasse().equals(request.getConfirmPwd())){
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
                        rv.getReceptionniste(),
                        rv.getPatient()
                )).toList();
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
                rv.getReceptionniste(),
                rv.getPatient());
        return ResponseEntity.ok(rendezVousDto);
    }

    @PostMapping("/rendezVous")
    public ResponseEntity<RendezVousDto> createRendezVous(
            @Valid @RequestBody CreateRendezVousDto request,
            UriComponentsBuilder uriBuilder) {

        var medecin = medecinRepository.findById(request.getMedecinId()).orElse(null);
        var patient = patientRepository.findById(request.getPatientId()).orElse(null);
        var receptionniste = receptionnisteRepository.findById(request.getReceptionnisteId()).orElse(null);

        if(medecin == null || patient == null || receptionniste == null) {
            if (medecin == null) {
                System.err.println("Medecin non trouvable");
            }
            if (patient == null) {
                System.err.println("Patient non trouvable");
            }
            if (receptionniste == null) {
                System.err.println("Receptionniste non trouvable");
            }
            return ResponseEntity.badRequest().build();
        }

        var rv =rendezVousDtoMapper.toEntity(request);
        rv.setMedecin(medecin);
        rv.setPatient(patient);
        rv.setReceptionniste(receptionniste);
        rv.setStatus(StatusRendezVous.En_attente);
        rv.setDateCreation(LocalDate.now());

        rendezVousRepository.save(rv);

        var historiqueRV = new HistoriqueRendezVous(
                null,
                request.getDate(),
                request.getDateCreation(),
                request.getHeure(),
                request.getMotif(),
                StatusRendezVous.En_attente,
                receptionniste,
                medecin,
                patient
        );
        historiqueRendezVousRepository.save(historiqueRV);

        var rendezVousDto = rendezVousDtoMapper.toDto(rv);
        var uri = uriBuilder.path("/RendezVous/{id}").buildAndExpand(rv.getId()).toUri();
        return ResponseEntity.created(uri).body(rendezVousDto);
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


}

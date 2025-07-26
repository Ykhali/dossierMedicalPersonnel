package com.example.backend.RestController;

import com.example.backend.Dao.PatientRepository;
import com.example.backend.Dto.AddPatientDto;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.Patient;
import com.example.backend.mapper.PatientDTOMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@RestController
@RequestMapping("/api/Patient")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private PatientDTOMapper patientDTOMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping
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
    }
}

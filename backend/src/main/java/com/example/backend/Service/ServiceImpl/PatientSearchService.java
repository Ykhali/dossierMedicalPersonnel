package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.PatientRepository;
import com.example.backend.Dto.PatientSearchResultDto;
import com.example.backend.Entity.Patient;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.*;

@Service
public class PatientSearchService {
    private final PatientRepository repo;
    public PatientSearchService(PatientRepository repo){ this.repo = repo; }

    public List<PatientSearchResultDto> search(String q){
        q = q == null ? "" : q.trim();
        if (q.isEmpty()) return List.of();

        List<Patient> found = new ArrayList<>();

        if (q.contains("@")) found.addAll(repo.findByEmailIgnoreCase(q));
        if (q.matches("\\d{6,}")) found.addAll(repo.findByTelephone(q));
        if (q.matches("[A-Za-z0-9]{5,}")) found.addAll(repo.findByCin(q));

        if (found.isEmpty()) found = repo.searchFuzzy(q);

        return found.stream().distinct().map(p ->
                new PatientSearchResultDto(
                        p.getId(),
                        p.getNom(), p.getPrenom(),
                        p.getCin(), p.getTelephone(), p.getEmail(),
                        p.getDatedenaissance() != null ? Period.between(p.getDatedenaissance(), LocalDate.now()).getYears() : null
                )
        ).toList();
    }
}
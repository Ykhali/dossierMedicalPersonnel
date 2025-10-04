package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.MedecinRepository;
import com.example.backend.Dto.MedecinSearchDto;
import com.example.backend.Entity.Medecin;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MedecinSearchService {
    private final MedecinRepository medecinRepository;

    public MedecinSearchService(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    public List<MedecinSearchDto> searchMedecin(String q) {
        q = q == null ? "" : q.trim();
        if (q.isEmpty()) return List.of();

        List<Medecin> found = new ArrayList<>();

        if (q.matches("[A-Za-z0-9]{5,}")) found.addAll(medecinRepository.findBySpecialiteIgnoreCase(q));
        if (q.matches("[A-Za-z]{5,}")) found.addAll(medecinRepository.findByNomCompletIgnoreCase(q));


        return found.stream().distinct()
                .map(m ->
                        new MedecinSearchDto(
                        m.getId(),
                        m.getNom(), m.getPrenom(),
                        m.getTelephone(), m.getAdresse(), m.getVille(),
                        m.getSpecialite(),
                        m.getSousSpecialites(),
                        m.getLangues(),
                        m.getBio()
                ))
                .toList();
    }
}

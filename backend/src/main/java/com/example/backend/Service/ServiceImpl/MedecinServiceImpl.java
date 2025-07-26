package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.MedecinRepository;
import com.example.backend.Entity.Medecin;
import com.example.backend.Service.Iservice.MedecinService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedecinServiceImpl implements MedecinService {

    private MedecinRepository medecinRepository;

    @Override
    public Medecin getMedecinById(Long id) {
        return medecinRepository.findMedecinById(id);
    }

    @Override
    public Medecin saveMedecin(Medecin medecin) {
        return null;
    }

    @Override
    public Medecin updateMedecin(Medecin medecin) {
        return null;
    }

    @Override
    public void deleteMedecin(Long id) {
        medecinRepository.deleteById(id);
    }

    @Override
    public List<Medecin> getAllMedecin() {
        return List.of();
    }
}

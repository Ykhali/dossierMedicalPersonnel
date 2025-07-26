package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.ReceptionnisteRepository;
import com.example.backend.Entity.Receptionniste;
import com.example.backend.Service.Iservice.ReceptionnisteService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReceptionnisteServiceImpl implements ReceptionnisteService {


    private ReceptionnisteRepository receptionnisteRepository;

    @Override
    public Receptionniste getReceptionnisteById(Long id) {
        return receptionnisteRepository.findReceptionnisteById(id);
    }

    @Override
    public Receptionniste saveReceptionniste(Receptionniste receptionniste) {
        return receptionnisteRepository.save(receptionniste);
    }

    @Override
    public List<Receptionniste> getAllReceptionniste() {
        return receptionnisteRepository.findAll();
    }

    @Override
    public void deleteReceptionniste(Long id) {
        receptionnisteRepository.deleteById(id);
    }

    @Override
    public Receptionniste updateReceptionniste(Receptionniste receptionniste) {
        return null;
    }
}

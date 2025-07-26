package com.example.backend.Service.Iservice;

import com.example.backend.Entity.Receptionniste;

import java.util.List;

public interface ReceptionnisteService {
    Receptionniste getReceptionnisteById(Long id);
    Receptionniste saveReceptionniste(Receptionniste receptionniste);
    List<Receptionniste> getAllReceptionniste();
    void deleteReceptionniste(Long id);
    Receptionniste updateReceptionniste(Receptionniste receptionniste);
}

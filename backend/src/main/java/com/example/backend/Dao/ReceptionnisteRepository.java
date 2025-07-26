package com.example.backend.Dao;

import com.example.backend.Entity.Receptionniste;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReceptionnisteRepository extends JpaRepository<Receptionniste, Long> {
    Receptionniste findReceptionnisteById(Long id);

}

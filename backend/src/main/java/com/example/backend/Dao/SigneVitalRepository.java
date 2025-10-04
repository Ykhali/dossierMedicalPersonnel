package com.example.backend.Dao;

import com.example.backend.Entity.SigneVital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SigneVitalRepository extends JpaRepository<SigneVital, Long> {
}

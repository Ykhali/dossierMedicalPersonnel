package com.example.backend.Service.Iservice;

import com.example.backend.Entity.Patient;

import java.util.List;

public interface PatientService {
    Patient getPatientById(Long id);
    List<Patient> getAllPatients();
    Patient addPatient(Patient patient);
    Patient updatePatient(Patient patient);
    void deletePatient(Long id);
}

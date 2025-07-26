package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.PatientRepository;
import com.example.backend.Entity.Patient;
import com.example.backend.Service.Iservice.PatientService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientServiceImpl implements PatientService {

    private PatientRepository patientRepository;
    @Override
    public Patient getPatientById(Long id) {
        return patientRepository.findPatientById(id);
    }

    @Override
    public List<Patient> getAllPatients() {
        return List.of();
    }

    @Override
    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    @Override
    public Patient updatePatient(Patient patient) {
        return null;
    }

    @Override
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}

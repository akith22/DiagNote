package com.example.backend.service;


import com.example.backend.dto.PatientDetailsDto;
import com.example.backend.dto.PatientProfileResponse;
import com.example.backend.model.Patient;
import com.example.backend.model.User;
import com.example.backend.repository.PatientRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PatientService {
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    public PatientProfileResponse getPatientProfile() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Patient> patientOpt = patientRepository.findByUser(user);

        if (patientOpt.isPresent()) {
            Patient patient = patientOpt.get();
            return new PatientProfileResponse(
                    user.getName(),
                    user.getEmail(),
                    patient.getGender(),
                    patient.getAddress(),
                    patient.getAge(),
                    true
            );
        } else {
            return new PatientProfileResponse(
                    user.getName(),
                    user.getEmail(),
                    null,
                    null,
                    null,
                    false
            );
        }
    }

    @Transactional
    public void saveOrUpdatePatientDetails(PatientDetailsDto patientDetailsDto) {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Patient> existingPatient = patientRepository.findByUser(user);

        Patient patient;
        if (existingPatient.isPresent()) {
            patient = existingPatient.get();
        } else {
            patient = new Patient();
            patient.setUser(user);
        }

        patient.setGender(patientDetailsDto.getGender());
        patient.setAddress(patientDetailsDto.getAddress());
        patient.setAge(patientDetailsDto.getAge());

        patientRepository.save(patient);
    }

    @Transactional
    public void deletePatientProfile() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        patientRepository.deleteByUser(user);
    }
}

package com.example.backend.controller;

import com.example.backend.dto.PrescriptionResponse;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/patient/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getPatientPrescriptions(Authentication authentication) {
        String email = authentication.getName();

        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        List<PrescriptionResponse> prescriptions = prescriptionService.getPrescriptionsForPatient(patient.getUserId());
        return ResponseEntity.ok(prescriptions);
    }
}

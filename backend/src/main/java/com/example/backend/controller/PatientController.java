package com.example.backend.controller;


import com.example.backend.dto.PatientDetailsDto;
import com.example.backend.dto.PatientProfileResponse;
import com.example.backend.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
@PreAuthorize("hasRole('PATIENT')")
public class PatientController {
    @Autowired
    private PatientService patientService;

    @GetMapping("/profile")
    public ResponseEntity<PatientProfileResponse> getPatientProfile() {
        PatientProfileResponse profile = patientService.getPatientProfile();
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/profile")
    public ResponseEntity<?> savePatientDetails(@RequestBody PatientDetailsDto patientDetailsDto) {
        patientService.saveOrUpdatePatientDetails(patientDetailsDto);
        return ResponseEntity.ok("Patient details saved successfully");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updatePatientDetails(@RequestBody PatientDetailsDto patientDetailsDto) {
        patientService.saveOrUpdatePatientDetails(patientDetailsDto);
        return ResponseEntity.ok("Patient details updated successfully");
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deletePatientDetails() {
        patientService.deletePatientProfile();
        return ResponseEntity.ok("Patient details deleted successfully");
    }
}

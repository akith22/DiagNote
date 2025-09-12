package com.example.backend.controller;


import com.example.backend.dto.DoctorDetailsDto;
import com.example.backend.dto.DoctorProfileResponse;
import com.example.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/profile")
    public ResponseEntity<DoctorProfileResponse> getDoctorProfile() {
        DoctorProfileResponse profile = doctorService.getDoctorProfile();
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/profile")
    public ResponseEntity<?> saveDoctorDetails(@RequestBody DoctorDetailsDto doctorDetailsDto) {
        doctorService.saveOrUpdateDoctorDetails(doctorDetailsDto);
        return ResponseEntity.ok("Doctor details saved successfully");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateDoctorDetails(@RequestBody DoctorDetailsDto doctorDetailsDto) {
        doctorService.saveOrUpdateDoctorDetails(doctorDetailsDto);
        return ResponseEntity.ok("Doctor details updated successfully");
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteDoctorDetails() {
        doctorService.deleteDoctorProfile();
        return ResponseEntity.ok("Doctor details deleted successfully");
    }
}
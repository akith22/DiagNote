package com.example.backend.controller;

import com.example.backend.dto.DoctorProfileResponse;
import com.example.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")  // plural for patient search
public class DoctorSearchController {

    @Autowired
    private DoctorService doctorService;

    // ✅ Public search endpoint (patients can call this)
    @GetMapping
    public ResponseEntity<List<DoctorProfileResponse>> searchDoctors(@RequestParam String search) {
        return ResponseEntity.ok(doctorService.searchDoctors(search));
    }
}
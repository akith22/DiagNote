package com.example.backend.controller;

import com.example.backend.dto.DoctorProfileResponse;
import com.example.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorSearchController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorProfileResponse>> searchDoctors(@RequestParam String search) {
        return ResponseEntity.ok(doctorService.searchDoctors(search));
    }
}
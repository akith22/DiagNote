package com.example.backend.controller;

import com.example.backend.dto.DoctorProfileResponse;
import com.example.backend.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@PreAuthorize("hasRole('PATIENT')")
public class DoctorSearchController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<DoctorProfileResponse>> searchDoctors(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String specialization) {

        return ResponseEntity.ok(doctorService.searchDoctors(name, specialization));
    }


}
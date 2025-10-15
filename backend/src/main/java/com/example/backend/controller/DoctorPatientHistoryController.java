package com.example.backend.controller;

import com.example.backend.dto.DoctorPatientHistoryDto;
import com.example.backend.service.DoctorPatientHistoryService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorPatientHistoryController {

    private final DoctorPatientHistoryService doctorPatientHistoryService;

    public DoctorPatientHistoryController(DoctorPatientHistoryService doctorPatientHistoryService) {
        this.doctorPatientHistoryService = doctorPatientHistoryService;
    }

    // Get patient history by appointment ID
    @GetMapping("/patient-history/{appointmentId}")
    public ResponseEntity<?> getPatientHistoryByAppointmentId(@PathVariable Integer appointmentId) {
        try {
            DoctorPatientHistoryDto dto = doctorPatientHistoryService.getPatientHistoryByAppointmentId(appointmentId);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No patient found with appointment ID: " + appointmentId));
        }
    }

}

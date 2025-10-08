package com.example.backend.controller;

import com.example.backend.dto.PrescriptionDto;
import com.example.backend.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')") // Only logged-in doctors can access
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping("/p/{appointmentId}/prescriptions")
    public ResponseEntity<PrescriptionDto> createPrescription(
            @PathVariable Integer appointmentId,
            @Valid @RequestBody PrescriptionDto dto) {

        PrescriptionDto created = prescriptionService.createPrescription(appointmentId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/prescriptions/{prescriptionId}")
    public ResponseEntity<PrescriptionDto> updatePrescription(
            @PathVariable Integer prescriptionId,
            @Valid @RequestBody PrescriptionDto dto) {

        PrescriptionDto updated = prescriptionService.updatePrescription(prescriptionId, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/prescriptions/{prescriptionId}")
    public ResponseEntity<String> deletePrescription(@PathVariable Integer prescriptionId) {
        prescriptionService.deletePrescription(prescriptionId);
        return ResponseEntity.ok("Prescription deleted successfully");
    }

    @GetMapping("/prescriptions/{prescriptionId}")
    public ResponseEntity<PrescriptionDto> getById(@PathVariable Integer prescriptionId) {
        PrescriptionDto dto = prescriptionService.getById(prescriptionId);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/appointments/{appointmentId}/prescriptions")
    public ResponseEntity<List<PrescriptionDto>> getByAppointment(@PathVariable Integer appointmentId) {
        List<PrescriptionDto> dtos = prescriptionService.getByAppointmentId(appointmentId);
        return ResponseEntity.ok(dtos);
    }

    // ---------------- New GET: Prescription + Patient Name ----------------
    @GetMapping("/prescriptions/{prescriptionId}/details")
    public ResponseEntity<Map<String, Object>> getPrescriptionDetails(@PathVariable Integer prescriptionId) {
        Map<String, Object> details = prescriptionService.getPrescriptionWithPatientName(prescriptionId);
        return ResponseEntity.ok(details);
    }

    // ---------------- New GET: All Prescriptions by Doctor ----------------
    @GetMapping("/prescriptions/doctor")
    public ResponseEntity<List<PrescriptionDto>> getAllPrescriptionsByDoctor(@RequestParam String email) {
        List<PrescriptionDto> dtos = prescriptionService.getAllPrescriptionsByDoctorId(email);
        return ResponseEntity.ok(dtos);
    }
    // ---------------- New GET: Patient Details by Appointment ----------------
    @GetMapping("/appointments/{appointmentId}/patient")
    public ResponseEntity<Map<String, Object>> getPatientDetailsByAppointment(
            @PathVariable Integer appointmentId) {

        Map<String, Object> patientDetails = prescriptionService.getPatientDetailsByAppointmentId(appointmentId);
        return ResponseEntity.ok(patientDetails);
    }



}

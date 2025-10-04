package com.example.backend.controller;

import com.example.backend.dto.PrescriptionDto;
import com.example.backend.exception.PrescriptionException;
import com.example.backend.exception.PrescriptionNotFoundException;
import com.example.backend.model.Appointment;
import com.example.backend.model.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.PrescriptionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Create a prescription for an appointment
     * Also marks the appointment as COMPLETED
     */
    @PostMapping("/appointments/{appointmentId}/prescriptions")
    public ResponseEntity<?> createPrescription(
            @PathVariable Long appointmentId,
            @RequestBody @Valid PrescriptionDto requestDto
    ) {
        try {
            // 1️⃣ Create the prescription
            PrescriptionDto dto = prescriptionService.createPrescription(appointmentId, requestDto.getNotesJson());

            // 2️⃣ Update the corresponding appointment status to COMPLETED using enum
            Appointment appointment = appointmentRepository.findById(appointmentId).orElse(null);
            if (appointment != null) {
                appointment.setStatus(Appointment.Status.COMPLETED); // <-- use enum, not string
                appointmentRepository.save(appointment);
            }

            return ResponseEntity.status(HttpStatus.CREATED).body(dto);
        } catch (PrescriptionException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }


    @PutMapping("/prescriptions/{prescriptionId}")
    public ResponseEntity<?> updatePrescription(
            @PathVariable Integer prescriptionId,
            @RequestBody @Valid PrescriptionDto requestDto
    ) {
        try {
            PrescriptionDto dto = prescriptionService.updatePrescription(prescriptionId, requestDto.getNotesJson());
            return ResponseEntity.ok(dto);
        } catch (PrescriptionException | PrescriptionNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @GetMapping("/appointments/{appointmentId}/prescription")
    public ResponseEntity<?> getByAppointment(@PathVariable Long appointmentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth == null ? null : auth.getName();
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Appointment appt = appointmentRepository.findById(appointmentId).orElse(null);
        if (appt == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        boolean allowed = (appt.getPatientId() != null && appt.getPatientId().equals(user.getUserId().longValue()))
                || (appt.getDoctorId() != null && appt.getDoctorId().equals(user.getUserId().longValue()));

        if (!allowed) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed to view this prescription.");

        try {
            PrescriptionDto dto = prescriptionService.getPrescriptionByAppointment(appointmentId);
            return ResponseEntity.ok(dto);
        } catch (PrescriptionNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/appointments/{appointmentId}/prescriptions")
    public ResponseEntity<?> listPrescriptions(@PathVariable Long appointmentId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth == null ? null : auth.getName();
        if (email == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Appointment appt = appointmentRepository.findById(appointmentId).orElse(null);
        if (appt == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        boolean allowed = (appt.getPatientId() != null && appt.getPatientId().equals(user.getUserId().longValue()))
                || (appt.getDoctorId() != null && appt.getDoctorId().equals(user.getUserId().longValue()));

        if (!allowed) return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed.");

        List<PrescriptionDto> prescriptions = prescriptionService.listByAppointment(appointmentId);

        User patient = userRepository.findById(appt.getPatientId().intValue()).orElse(null);
        String patientName = patient != null ? patient.getName() : "Unknown";

        List<Map<String, Object>> response = prescriptions.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("appointmentId", p.getAppointmentId());
            map.put("dateIssued", p.getDateIssued());
            map.put("notesJson", p.getNotesJson());
            map.put("patientName", patientName);
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }


    /**
     * List all prescriptions created by the currently authenticated doctor
     */
    @GetMapping("/prescriptions/mine")
    public ResponseEntity<?> listMyPrescriptions() {
        User doctor = getAuthenticatedUser();
        if (doctor == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Doctor must be authenticated.");
        }

        List<PrescriptionDto> prescriptions = prescriptionService.listByDoctor(doctor.getUserId().longValue());

        // Optionally include patient names
        List<Map<String, Object>> response = prescriptions.stream().map(p -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", p.getId());
            map.put("appointmentId", p.getAppointmentId());
            map.put("dateIssued", p.getDateIssued());
            map.put("notesJson", p.getNotesJson());

            // Fetch patient name from appointment
            Appointment appt = appointmentRepository.findById(p.getAppointmentId()).orElse(null);
            if (appt != null && appt.getPatientId() != null) {
                User patient = userRepository.findById(appt.getPatientId().intValue()).orElse(null);
                map.put("patientName", patient != null ? patient.getName() : "Unknown");
            } else {
                map.put("patientName", "Unknown");
            }

            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }

    // Helper to get authenticated user (doctor)
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }


}

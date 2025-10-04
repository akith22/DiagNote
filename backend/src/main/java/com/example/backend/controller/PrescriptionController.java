package com.example.backend.controller;

import com.example.backend.dto.PrescriptionDto;
import com.example.backend.exception.PrescriptionException;
import com.example.backend.exception.PrescriptionNotFoundException;
import com.example.backend.model.Appointment;
import com.example.backend.model.Doctor;
import com.example.backend.model.Patient;
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

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @PostMapping("/appointments/{appointmentId}/prescriptions")
    public ResponseEntity<?> createPrescription(
            @PathVariable Integer appointmentId,
            @RequestBody @Valid PrescriptionDto requestDto
    ) {
        try {
            PrescriptionDto dto = prescriptionService.createPrescription(appointmentId, requestDto.getNotesJson());
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
    public ResponseEntity<?> getLatestPrescription(@PathVariable Integer appointmentId) {
        User loggedUser = getAuthenticatedUser();
        if (loggedUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Appointment appt = appointmentRepository.findById(appointmentId).orElse(null);
        if (appt == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");

        if (!isUserAllowed(appt, loggedUser))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed to view this prescription.");

        try {
            PrescriptionDto dto = prescriptionService.getPrescriptionByAppointment(appointmentId);
            return ResponseEntity.ok(dto);
        } catch (PrescriptionNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/appointments/{appointmentId}/prescriptions")
    public ResponseEntity<?> listPrescriptions(@PathVariable Integer appointmentId) {
        User loggedUser = getAuthenticatedUser();
        if (loggedUser == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Appointment appt = appointmentRepository.findById(appointmentId).orElse(null);
        if (appt == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");

        if (!isUserAllowed(appt, loggedUser))
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed to view prescriptions.");

        List<PrescriptionDto> list = prescriptionService.listByAppointment(appointmentId);
        return ResponseEntity.ok(list);
    }

    // ✅ Helper method to check if the user is allowed (doctor or patient)
    private boolean isUserAllowed(Appointment appt, User user) {
        Doctor doctor = appt.getDoctor();
        Patient patient = appt.getPatient();

        boolean isDoctor = doctor != null && doctor.getUser() != null && doctor.getUser().getUserId().equals(user.getUserId());
        boolean isPatient = patient != null && patient.getUser() != null && patient.getUser().getUserId().equals(user.getUserId());

        return isDoctor || isPatient;
    }
}

package com.example.backend.controller;

import com.example.backend.dto.AppointmentRequest;
import com.example.backend.dto.AppointmentResponse;
import com.example.backend.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentRequest request) {
        AppointmentResponse resp = appointmentService.bookAppointment(request);

        if (resp == null) {
            // Doctor already has a booking at this time
            return ResponseEntity
                    .status(409) // Conflict
                    .body(Map.of("message", "Doctor already has a booking at this time"));
        }

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<AppointmentResponse>> getDoctorAppointments(@PathVariable Integer doctorId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForDoctor(doctorId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getPatientAppointments(@PathVariable Integer patientId) {
        return ResponseEntity.ok(appointmentService.getAppointmentsForPatient(patientId));
    }

    @DeleteMapping("/{appointmentId}")
    public ResponseEntity<Map<String, String>> cancelAppointment(@PathVariable Integer appointmentId) {
        appointmentService.cancelAppointment(appointmentId);
        return ResponseEntity.ok(Map.of("message", "Appointment cancelled"));
    }

    @PutMapping("/{appointmentId}/reschedule")
    public ResponseEntity<?> reschedule(@PathVariable Integer appointmentId,
                                        @RequestBody Map<String, String> payload) {
        LocalDateTime newDt = LocalDateTime.parse(payload.get("appointmentDateTime"));
        AppointmentResponse resp = appointmentService.rescheduleAppointment(appointmentId, newDt);

        if (resp == null) {
            return ResponseEntity
                    .status(409)
                    .body(Map.of("message", "Doctor already has a booking at the requested time"));
        }

        return ResponseEntity.ok(resp);
    }
}

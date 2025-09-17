package com.example.backend.controller;

import com.example.backend.model.Doctor;
import com.example.backend.service.DoctorAppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor/appointments") // clearer naming
public class DoctorAppointmentController {

    private final DoctorAppointmentService doctorAppointmentService;

    public DoctorAppointmentController(DoctorAppointmentService doctorAppointmentService) {
        this.doctorAppointmentService = doctorAppointmentService;
    }

    // Get my availability
    @GetMapping("/availability")
    public ResponseEntity<String> getAvailability() {
        return ResponseEntity.ok(doctorAppointmentService.getAvailableTimes());
    }

    // Update/set my availability
    @PutMapping("/availability")
    public ResponseEntity<Doctor> updateAvailability(@RequestBody String availableTimes) {
        return ResponseEntity.ok(doctorAppointmentService.updateAvailableTimes(availableTimes));
    }

    // Clear my availability
    @DeleteMapping("/availability")
    public ResponseEntity<String> clearAvailability() {
        doctorAppointmentService.clearAvailableTimes();
        return ResponseEntity.ok("Availability cleared");
    }
}

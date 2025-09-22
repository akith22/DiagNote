package com.example.backend.controller;

import com.example.backend.model.Appointment;
import com.example.backend.model.Doctor;
import com.example.backend.service.DoctorAppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/doctor/appointments")
public class DoctorAppointmentController {

    private final DoctorAppointmentService doctorAppointmentService;

    public DoctorAppointmentController(DoctorAppointmentService doctorAppointmentService) {
        this.doctorAppointmentService = doctorAppointmentService;
    }

    // 🔹 Availability Endpoints
    @GetMapping("/availability")
    public ResponseEntity<String> getAvailability() {
        return ResponseEntity.ok(doctorAppointmentService.getAvailableTimes());
    }

    @PutMapping("/availability")
    public ResponseEntity<Doctor> updateAvailability(@RequestBody String availableTimes) {
        return ResponseEntity.ok(doctorAppointmentService.updateAvailableTimes(availableTimes));
    }

    @DeleteMapping("/availability")
    public ResponseEntity<String> clearAvailability() {
        doctorAppointmentService.clearAvailableTimes();
        return ResponseEntity.ok("Availability cleared");
    }

    // 🔹 Filtering Endpoints

    // By Status
    @GetMapping("/filter/status")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatus(@RequestParam Appointment.Status status) {
        return ResponseEntity.ok(doctorAppointmentService.getAppointmentsByStatus(status));
    }

    // By Time Range
   /* @GetMapping("/filter/time")
    public ResponseEntity<List<Appointment>> getAppointmentsByTimeRange(
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(doctorAppointmentService.getAppointmentsByTimeRange(start, end));
    }*/

    // By Month
    @GetMapping("/filter/month")
    public ResponseEntity<List<Appointment>> getAppointmentsByMonth(
            @RequestParam int month,
            @RequestParam int year) {
        return ResponseEntity.ok(doctorAppointmentService.getAppointmentsByMonth(month, year));
    }

    // By Week
    @GetMapping("/filter/week")
    public ResponseEntity<List<Appointment>> getAppointmentsByWeek(
            @RequestParam int week,
            @RequestParam int year) {
        return ResponseEntity.ok(doctorAppointmentService.getAppointmentsByWeek(week, year));
    }

    // By Status + Time Range (combined)
   /* @GetMapping("/filter/status-time")
    public ResponseEntity<List<Appointment>> getAppointmentsByStatusAndTimeRange(
            @RequestParam Appointment.Status status,
            @RequestParam LocalDateTime start,
            @RequestParam LocalDateTime end) {
        return ResponseEntity.ok(doctorAppointmentService.getAppointmentsByStatusAndTimeRange(status, start, end));
    }*/
}

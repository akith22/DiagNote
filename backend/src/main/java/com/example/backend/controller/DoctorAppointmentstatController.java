package com.example.backend.controller;

import com.example.backend.dto.AppointmentDto;
import com.example.backend.service.DoctorAppointmentstatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctor/appointments")
public class DoctorAppointmentstatController {

    @Autowired
    private DoctorAppointmentstatService appointmentService;

    /**
     * GET /api/doctor/appointments?status=PENDING
     * Get appointments for authenticated doctor
     */
    @GetMapping
    public ResponseEntity<List<AppointmentDto>> getAppointments(
            @RequestParam(name = "status", required = false) String status) {
        List<AppointmentDto> appointments =
                appointmentService.getAppointmentsForAuthenticatedDoctor(Optional.ofNullable(status));
        return ResponseEntity.ok(appointments);
    }

    /**
     * POST /api/doctor/appointments/{id}/accept
     * Accept appointment
     */
    @PostMapping("/{appointmentId}/accept")
    public ResponseEntity<AppointmentDto> acceptAppointment(@PathVariable Integer appointmentId) {
        Integer doctorId = appointmentService.getAuthenticatedDoctorId();
        AppointmentDto dto = appointmentService.acceptAppointment(appointmentId, doctorId);
        return ResponseEntity.ok(dto);
    }

    /**
     * POST /api/doctor/appointments/{id}/decline
     * Decline appointment
     */
    @PostMapping("/{appointmentId}/decline")
    public ResponseEntity<AppointmentDto> declineAppointment(@PathVariable Integer appointmentId) {
        Integer doctorId = appointmentService.getAuthenticatedDoctorId();
        AppointmentDto dto = appointmentService.declineAppointment(appointmentId, doctorId);
        return ResponseEntity.ok(dto);
    }
}

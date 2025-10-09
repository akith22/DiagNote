package com.example.backend.controller;

import com.example.backend.dto.DoctorLabRequestDto;
import com.example.backend.service.DoctorLabRequestService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorLabRequestController {

    private final DoctorLabRequestService doctorLabRequestService;

    public DoctorLabRequestController(DoctorLabRequestService doctorLabRequestService) {
        this.doctorLabRequestService = doctorLabRequestService;
    }

    // ✅ Create new lab request using appointmentId
    @PostMapping("/appointments/{appointmentId}/labrequests")
    public ResponseEntity<DoctorLabRequestDto> createLabRequest(
            @PathVariable Integer appointmentId,
            @Valid @RequestBody DoctorLabRequestDto dto) {

        DoctorLabRequestDto created = doctorLabRequestService.createLabRequest(appointmentId, dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ✅ Get all lab requests for a given appointment
    @GetMapping("/appointments/{appointmentId}/labrequests")
    public ResponseEntity<List<DoctorLabRequestDto>> getLabRequestsByAppointment(@PathVariable Integer appointmentId) {
        List<DoctorLabRequestDto> dtos = doctorLabRequestService.getLabRequestsByAppointment(appointmentId);
        return ResponseEntity.ok(dtos);
    }

    // ✅ Get single lab request
    @GetMapping("/labrequests/{id}")
    public ResponseEntity<DoctorLabRequestDto> getLabRequestById(@PathVariable Integer id) {
        DoctorLabRequestDto dto = doctorLabRequestService.getLabRequestById(id);
        return ResponseEntity.ok(dto);
    }
}

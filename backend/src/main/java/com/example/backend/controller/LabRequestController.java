package com.example.backend.controller;

import com.example.backend.dto.LabRequestDto;
import com.example.backend.model.LabRequest;
import com.example.backend.service.LabRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-requests")
@PreAuthorize("hasAnyRole('LABTECH')") // adjust roles as needed
public class LabRequestController {

    @Autowired
    private LabRequestService labRequestService;

    /**
     * 🔹 Create a new lab request (linked to an appointment)
     */
   /* @PostMapping
    public ResponseEntity<LabRequestDto> createLabRequest(@RequestBody LabRequestDto dto) {
        LabRequestDto created = labRequestService.createLabRequest(dto);
        return ResponseEntity.ok(created);
    }*/

    /**
     * 🔹 Get all lab requests
     */
    @GetMapping
    public ResponseEntity<List<LabRequestDto>> getAllLabRequests() {
        List<LabRequestDto> requests = labRequestService.getAllLabRequests();
        return ResponseEntity.ok(requests);
    }

    /**
     * 🔹 Get lab requests for a specific appointment
     */
    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<LabRequestDto>> getLabRequestsByAppointment(@PathVariable Integer appointmentId) {
        List<LabRequestDto> requests = labRequestService.getLabRequestsByAppointment(appointmentId);
        return ResponseEntity.ok(requests);
    }

    /**
     * 🔹 Update lab request status (REQUESTED → COMPLETED)
     */
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<LabRequestDto> updateStatus(
            @PathVariable Integer id,
            @PathVariable LabRequest.Status status) {

        LabRequestDto updated = labRequestService.updateLabRequestStatus(id, status);
        return ResponseEntity.ok(updated);
}
}

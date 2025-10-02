package com.example.backend.controller;

import com.example.backend.dto.LabRequestDto;
import com.example.backend.dto.LabRequestResponse;
import com.example.backend.model.LabRequestStatus;
import com.example.backend.service.LabRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lab-requests")
@PreAuthorize("hasRole('LABTECH')")
public class LabRequestController {

    @Autowired
    private LabRequestService labRequestService;

    /**
     * Get all lab requests for authenticated lab tech
     * Optional filter by status: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
     */
    @GetMapping
    public ResponseEntity<List<LabRequestResponse>> getLabRequests(
            @RequestParam(name = "status", required = false) LabRequestStatus status) {

        List<LabRequestResponse> requests;
        if (status != null) {
            // Filter by status
            requests = labRequestService.getLabRequestsForLabTech()
                    .stream()
                    .filter(r -> r.getStatus().equalsIgnoreCase(status.name()))
                    .toList();
        } else {
            // Get all
            requests = labRequestService.getLabRequestsForLabTech();
        }

        return ResponseEntity.ok(requests);
    }

    /**
     * Update lab request status (e.g., mark as COMPLETED)
     */
    @PutMapping("/{id}/status/{status}")
    public ResponseEntity<LabRequestResponse> updateStatus(
            @PathVariable Long id,
            @PathVariable LabRequestStatus status) {

        LabRequestResponse updated = labRequestService.updateLabRequestStatus(id, status);
        return ResponseEntity.ok(updated);
    }

    // You can uncomment this if you want delete functionality
//    @DeleteMapping("/{id}")
//    public ResponseEntity<Map<String, String>> deleteRequest(@PathVariable Long id) {
//        labRequestService.deleteRequest(id);
//        return ResponseEntity.ok(Map.of("message", "Lab request deleted"));
//    }
}

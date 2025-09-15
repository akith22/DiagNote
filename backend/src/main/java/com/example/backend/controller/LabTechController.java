package com.example.backend.controller;


import com.example.backend.dto.LabTechDetailsDto;
import com.example.backend.dto.LabTechProfileResponse;
import com.example.backend.service.LabTechService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/labtech")
@PreAuthorize("hasRole('LABTECH')")
public class LabTechController {
    @Autowired
    private LabTechService labTechService;

    @GetMapping("/profile")
    public ResponseEntity<LabTechProfileResponse> getLabTechProfile() {
        LabTechProfileResponse profile = labTechService.getLabTechProfile();
        return ResponseEntity.ok(profile);
    }

    @PostMapping("/profile")
    public ResponseEntity<?> saveLabTechDetails(@RequestBody LabTechDetailsDto labTechDetailsDto) {
        labTechService.saveOrUpdateLabTechDetails(labTechDetailsDto);
        return ResponseEntity.ok("Lab Tech details saved successfully");
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateLabTechDetails(@RequestBody LabTechDetailsDto labTechDetailsDto) {
        labTechService.saveOrUpdateLabTechDetails(labTechDetailsDto);
        return ResponseEntity.ok("Lab Tech details updated successfully");
    }

    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteLabTechDetails() {
        labTechService.deleteLabTechProfile();
        return ResponseEntity.ok("Lab Tech details deleted successfully");
    }

}

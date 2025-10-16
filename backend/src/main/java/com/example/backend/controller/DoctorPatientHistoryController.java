package com.example.backend.controller;

import com.example.backend.dto.DoctorPatientHistoryDto;
import com.example.backend.dto.PatientHistoryDto;
import com.example.backend.model.LabReport;
import com.example.backend.service.DoctorPatientHistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/doctor")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorPatientHistoryController {

    @Autowired
    private  DoctorPatientHistoryService doctorPatientHistoryService;

    public DoctorPatientHistoryController(DoctorPatientHistoryService doctorPatientHistoryService) {
        this.doctorPatientHistoryService = doctorPatientHistoryService;
    }

    // Get patient history by appointment ID
    @GetMapping("/patient-history")
    public ResponseEntity<?> getPatientHistoryByAppointmentId(@RequestParam String email) {
        try {
            PatientHistoryDto dto = doctorPatientHistoryService.getPatientHistoryByPatientEmail(email);
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "No patient found with appointment ID: " + email));
        }
    }


    @GetMapping("/lab-reports/file/{fileName:.+}")
    public ResponseEntity<Resource> getLabReportFileByName(@PathVariable String fileName) {
        try {
            System.out.println("🚀 Request received for file: " + fileName);

            // Validate file name
            if (fileName == null || fileName.trim().isEmpty() || fileName.contains("..")) {
                System.err.println("❌ Invalid file name: " + fileName);
                return ResponseEntity.badRequest().build();
            }

            // Get the file resource
            Resource resource = doctorPatientHistoryService.getLabReportFile(fileName);

            // ✅ FIXED: Use the correct path for content type detection
            Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
            Path filePath = uploadDir.resolve(fileName).normalize();

            String contentType = null;
            try {
                contentType = Files.probeContentType(filePath);
                System.out.println("📄 Detected content type: " + contentType);
            } catch (IOException e) {
                System.err.println("⚠️ Could not detect content type: " + e.getMessage());
            }

            if (contentType == null) {
                // ✅ Set appropriate content types for common file types
                if (fileName.toLowerCase().endsWith(".pdf")) {
                    contentType = "application/pdf";
                } else if (fileName.toLowerCase().endsWith(".docx")) {
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                } else if (fileName.toLowerCase().endsWith(".doc")) {
                    contentType = "application/msword";
                } else if (fileName.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (fileName.toLowerCase().endsWith(".jpg") || fileName.toLowerCase().endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                } else {
                    contentType = "application/octet-stream";
                }
                System.out.println("📄 Using determined content type: " + contentType);
            }

            // ✅ Return file inline (preview) and allow browser download
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + fileName + "\"")
                    .body(resource);

        } catch (RuntimeException e) {
            // Log the specific error
            System.err.println("❌ File access error for '" + fileName + "': " + e.getMessage());

            // Check if it's a "not found" error
            if (e.getMessage() != null && e.getMessage().contains("not found")) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(null);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(null);
            }
        } catch (Exception e) {
            System.err.println("💥 Unexpected error for file '" + fileName + "': " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
package com.example.backend.controller;

import com.example.backend.dto.ViewLabReportDto;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ViewLabReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/patient/lab-reports")
<<<<<<< HEAD
@PreAuthorize("hasRole('PATIENT')")
=======
>>>>>>> origin/main
public class ViewLabReportController {

    @Autowired
    private ViewLabReportService viewLabReportService;

    @Autowired
    private UserRepository userRepository;

    /**
     * ✅ Get all lab reports for the logged-in patient
     */
    @GetMapping
    public ResponseEntity<?> getPatientLabReports(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<ViewLabReportDto> reports = viewLabReportService.getLabReportsForPatient(user.getUserId());

        if (reports.isEmpty()) {
            return ResponseEntity.ok("No lab reports available.");
        }

        return ResponseEntity.ok(reports);
    }

    /**
     * ✅ Fetch and stream lab report file (PDF, image, etc.)
     */
    @GetMapping("/file/{fileName:.+}")
    public ResponseEntity<Resource> getLabReportFile(@PathVariable String fileName) {
        try {
            // ✅ Path to your uploads folder (project root level)
            Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();

            // ✅ Resolve the requested file safely
            Path filePath = uploadDir.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            // ✅ Detect file content type automatically
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            // ✅ Return file inline (preview) and allow browser download
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}

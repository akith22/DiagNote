package com.example.backend.controller;

import com.example.backend.dto.ViewLabReportDto;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ViewLabReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patient/lab-reports")
public class ViewLabReportController {

    @Autowired
    private ViewLabReportService viewLabReportService;

    @Autowired
    private UserRepository userRepository;

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
}

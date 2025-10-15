package com.example.backend.controller;

import com.example.backend.dto.DoctorLabReportDto;
import com.example.backend.service.DoctorLabReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor/lab-reports")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorLabReportController {

    @Autowired
    private DoctorLabReportService doctorLabReportService;

    /**
     * 🔹 Get all lab reports
     */
    @GetMapping
    public ResponseEntity<List<DoctorLabReportDto>> getAllLabReports() {
        List<DoctorLabReportDto> reports = doctorLabReportService.getAllLabReports();
        return ResponseEntity.ok(reports);
    }

    /**
     * 🔹 Get report by LabRequest ID
     */
    @GetMapping("/{labRequestId}")
    public ResponseEntity<DoctorLabReportDto> getLabReportByLabRequest(@PathVariable Integer labRequestId) {
        return doctorLabReportService.getReportByLabRequestId(labRequestId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

package com.example.backend.controller;

import com.example.backend.dto.DoctorLabReportDto;
import com.example.backend.service.DoctorLabReportService;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/doctor/labreports")
@PreAuthorize("hasRole('DOCTOR')")
public class DoctorLabReportController {

    private final DoctorLabReportService doctorLabReportService;

    public DoctorLabReportController(DoctorLabReportService doctorLabReportService) {
        this.doctorLabReportService = doctorLabReportService;
    }

    /** ✅ Fetch all lab reports belonging to the authenticated doctor */
    @GetMapping
    public ResponseEntity<List<DoctorLabReportDto>> getAllReportsForDoctor() {
        List<DoctorLabReportDto> reports = doctorLabReportService.getAllLabReportsForDoctor();
        return ResponseEntity.ok(reports);
    }

    /** ✅ Fetch single report by labRequestId */
    @GetMapping("/by-request/{labRequestId}")
    public ResponseEntity<DoctorLabReportDto> getReportByLabRequest(@PathVariable Integer labRequestId) {
        DoctorLabReportDto dto = doctorLabReportService.getLabReportByLabRequestId(labRequestId);
        return ResponseEntity.ok(dto);
    }

    /** ✅ Download the report file */
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> downloadReport(@PathVariable String fileName) {
        Resource resource = doctorLabReportService.getLabReportFile(fileName);

        String contentType = "application/octet-stream";
        try {
            Path path = resource.getFile().toPath();
            contentType = Files.probeContentType(path);
        } catch (IOException ignored) {}

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}

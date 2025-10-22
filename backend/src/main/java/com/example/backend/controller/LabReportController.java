package com.example.backend.controller;

import com.example.backend.dto.LabReportDto;
import com.example.backend.service.FileStorageService;
import com.example.backend.service.LabReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/lab-reports")
@PreAuthorize("hasAnyRole('LABTECH')")
public class LabReportController {

    @Autowired
    private LabReportService labReportService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload-multiple")
    public ResponseEntity<List<LabReportDto>> uploadMultipleReports(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("labRequestId") Integer labRequestId) {

        List<LabReportDto> createdReports = labReportService.uploadMultipleReports(files, labRequestId);
        return ResponseEntity.ok(createdReports);
    }

    @PostMapping("/upload")
    public ResponseEntity<LabReportDto> uploadReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("labRequestId") Integer labRequestId) {

        LabReportDto created = labReportService.uploadReport(file, labRequestId);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<List<LabReportDto>> getAllReports() {
        List<LabReportDto> reports = labReportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/lab-request/{labRequestId}")
    public ResponseEntity<List<LabReportDto>> getReportsByLabRequest(@PathVariable Integer labRequestId) {
        List<LabReportDto> reports = labReportService.getReportsByLabRequest(labRequestId);
        return ResponseEntity.ok(reports);
    }

    // 🔹 New endpoint to serve uploaded files
    @GetMapping("/files/{fileName:.+}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        String contentType = "application/octet-stream";
        try {
            Path path = resource.getFile().toPath();
            contentType = Files.probeContentType(path);
        } catch (IOException ignored) {}

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }
}

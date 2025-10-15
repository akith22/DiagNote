//package com.example.backend.controller;
//
//import com.example.backend.dto.LabReportDto;
//import com.example.backend.service.LabReportService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/lab-reports")
//@PreAuthorize("hasAnyRole('LABTECH')")
//public class LabReportController {
//
//    @Autowired
//    private LabReportService labReportService;
//
//    /**
//     * 🔹 Upload a lab report (only by Lab Technician for REQUESTED tests)
//     */
//    @PostMapping("/upload")
//    @PreAuthorize("hasRole('LABTECH')")
//    public ResponseEntity<LabReportDto> uploadReport(
//            @RequestParam("file") MultipartFile file,
//            @RequestParam("labRequestId") Integer labRequestId) {
//
//        // Pass file and IDs directly to the service
//        LabReportDto created = labReportService.uploadReport(file, labRequestId);
//        return ResponseEntity.ok(created);
//    }
//
//    /**
//     * 🔹 Get all reports
//     */
//    @GetMapping
//    public ResponseEntity<List<LabReportDto>> getAllReports() {
//        List<LabReportDto> reports = labReportService.getAllReports();
//        return ResponseEntity.ok(reports);
//    }
//
//    /**
//     * 🔹 Get report by LabRequest ID
//     */
//    @GetMapping("/lab-request/{labRequestId}")
//    public ResponseEntity<LabReportDto> getReportByLabRequest(@PathVariable Integer labRequestId) {
//        return labReportService.getReportByLabRequest(labRequestId)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//}






package com.example.backend.controller;

import com.example.backend.dto.LabReportDto;
import com.example.backend.service.LabReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/lab-reports")
@PreAuthorize("hasAnyRole('LABTECH')")
public class LabReportController {

    @Autowired
    private LabReportService labReportService;

    /**
     * 🔹 Upload multiple lab reports at once (only by Lab Technician for REQUESTED tests)
     */
    @PostMapping("/upload-multiple")
    public ResponseEntity<List<LabReportDto>> uploadMultipleReports(
            @RequestParam("files") MultipartFile[] files,
            @RequestParam("labRequestId") Integer labRequestId) {

        List<LabReportDto> createdReports = labReportService.uploadMultipleReports(files, labRequestId);
        return ResponseEntity.ok(createdReports);
    }

    /**
     * 🔹 Upload a single lab report (still supported)
     */
    @PostMapping("/upload")
    public ResponseEntity<LabReportDto> uploadReport(
            @RequestParam("file") MultipartFile file,
            @RequestParam("labRequestId") Integer labRequestId) {

        LabReportDto created = labReportService.uploadReport(file, labRequestId);
        return ResponseEntity.ok(created);
    }

    /**
     * 🔹 Get all reports
     */
    @GetMapping
    public ResponseEntity<List<LabReportDto>> getAllReports() {
        List<LabReportDto> reports = labReportService.getAllReports();
        return ResponseEntity.ok(reports);
    }

    /**
     * 🔹 Get report by LabRequest ID
     */
    @GetMapping("/lab-request/{labRequestId}")
    public ResponseEntity<List<LabReportDto>> getReportsByLabRequest(@PathVariable Integer labRequestId) {
        List<LabReportDto> reports = labReportService.getReportsByLabRequest(labRequestId);
        return ResponseEntity.ok(reports);
    }
}

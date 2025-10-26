package com.example.backend.service;

import com.example.backend.dto.LabReportDto;
import com.example.backend.model.LabReport;
import com.example.backend.model.LabRequest;
import com.example.backend.model.LabTech;
import com.example.backend.model.User;
import com.example.backend.repository.LabReportRepository;
import com.example.backend.repository.LabRequestRepository;
import com.example.backend.repository.LabTechRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LabReportService {

    @Autowired
    private LabReportRepository labReportRepository;

    @Autowired
    private LabTechRepository labTechRepository;

    @Autowired
    private LabRequestRepository labRequestRepository;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private UserRepository userRepository;


    /**
     * 🔹 Upload a single lab report
     */
    public LabReportDto uploadReport(MultipartFile file, Integer labRequestId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;

        String email = auth.getName(); // JWT username = email
        User user = userRepository.findByEmail(email).orElse(null);

        LabTech labTech = labTechRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Lab technician not found"));

        LabRequest labRequest = labRequestRepository.findById(labRequestId)
                .orElseThrow(() -> new RuntimeException("Lab request not found"));

        if (!"REQUESTED".equalsIgnoreCase(labRequest.getStatus().name())) {
            throw new RuntimeException("Only REQUESTED lab tests can have reports uploaded");
        }

        // Store file physically
        String storedFileName = fileStorageService.storeFile(file);

        LabReport report = new LabReport();
        report.setReportFile(storedFileName);
        report.setDateIssued(LocalDateTime.now());
        report.setLabTech(labTech);
        report.setLabRequest(labRequest);

        LabReport saved = labReportRepository.save(report);

        // Update lab request status to COMPLETED after first upload
        labRequest.setStatus(LabRequest.Status.COMPLETED);
        labRequestRepository.save(labRequest);

        return new LabReportDto(
                saved.getId(),
                saved.getReportFile(),
                saved.getDateIssued(),
                saved.getLabTech().getId(),
                saved.getLabRequest().getId()
        );
    }

    /**
     * 🔹 Upload multiple lab reports for the same Lab Request
     */
    public List<LabReportDto> uploadMultipleReports(MultipartFile[] files, Integer labRequestId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;

        String email = auth.getName();
        User user = userRepository.findByEmail(email).orElse(null);

        LabTech labTech = labTechRepository.findById(user.getUserId())
                .orElseThrow(() -> new RuntimeException("Lab technician not found"));

        LabRequest labRequest = labRequestRepository.findById(labRequestId)
                .orElseThrow(() -> new RuntimeException("Lab request not found"));

        if (!"REQUESTED".equalsIgnoreCase(labRequest.getStatus().name())) {
            throw new RuntimeException("Only REQUESTED lab tests can have reports uploaded");
        }

        List<LabReportDto> uploadedReports = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;

            String storedFileName = fileStorageService.storeFile(file);

            LabReport report = new LabReport();
            report.setReportFile(storedFileName);
            report.setDateIssued(LocalDateTime.now());
            report.setLabTech(labTech);
            report.setLabRequest(labRequest);

            LabReport saved = labReportRepository.save(report);

            uploadedReports.add(new LabReportDto(
                    saved.getId(),
                    saved.getReportFile(),
                    saved.getDateIssued(),
                    saved.getLabTech().getId(),
                    saved.getLabRequest().getId()
            ));
        }

        // Once all uploads are done, mark request COMPLETED
        if (!uploadedReports.isEmpty()) {
            labRequest.setStatus(LabRequest.Status.COMPLETED);
            labRequestRepository.save(labRequest);
        }

        return uploadedReports;
    }

    /**
     * 🔹 Get all reports
     */
    public List<LabReportDto> getAllReports() {
        return labReportRepository.findAll().stream()
                .map(r -> new LabReportDto(
                        r.getId(),
                        r.getReportFile(),
                        r.getDateIssued(),
                        r.getLabTech().getId(),
                        r.getLabRequest().getId()
                ))
                .collect(Collectors.toList());
    }

    /**
     * 🔹 Get reports by LabRequest
     */
    public List<LabReportDto> getReportsByLabRequest(Integer labRequestId) {
        LabRequest labRequest = labRequestRepository.findById(labRequestId)
                .orElseThrow(() -> new RuntimeException("Lab request not found"));

        List<LabReport> reports = labReportRepository.findAll()
                .stream()
                .filter(r -> r.getLabRequest().getId().equals(labRequestId))
                .collect(Collectors.toList());

        return reports.stream()
                .map(r -> new LabReportDto(
                        r.getId(),
                        r.getReportFile(),
                        r.getDateIssued(),
                        r.getLabTech().getId(),
                        r.getLabRequest().getId()
                ))
                .collect(Collectors.toList());
    }
}





package com.example.backend.service;

import com.example.backend.dto.LabReportDto;
import com.example.backend.model.LabReport;
import com.example.backend.model.LabRequest;
import com.example.backend.model.LabTech;
import com.example.backend.repository.LabReportRepository;
import com.example.backend.repository.LabRequestRepository;
import com.example.backend.repository.LabTechRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
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

    /**
     * 🔹 Create and upload a new lab report (only if request status is REQUESTED)
     */
    public LabReportDto uploadReport(MultipartFile file, Integer labTechId, Integer labRequestId) {
        LabTech labTech = labTechRepository.findById(labTechId)
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

        // Save report
        LabReport saved = labReportRepository.save(report);

        // Change LabRequest status to COMPLETED
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
     * 🔹 Get report by lab request
     */
    public Optional<LabReportDto> getReportByLabRequest(Integer labRequestId) {
        LabRequest labRequest = labRequestRepository.findById(labRequestId)
                .orElseThrow(() -> new RuntimeException("Lab request not found"));

        return labReportRepository.findByLabRequest(labRequest)
                .map(r -> new LabReportDto(
                        r.getId(),
                        r.getReportFile(),
                        r.getDateIssued(),
                        r.getLabTech().getId(),
                        r.getLabRequest().getId()
                ));
    }
}







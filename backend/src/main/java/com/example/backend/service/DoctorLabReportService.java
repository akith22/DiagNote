package com.example.backend.service;

import com.example.backend.dto.DoctorLabReportDto;
import com.example.backend.model.LabReport;
import com.example.backend.model.LabRequest;
import com.example.backend.repository.LabReportRepository;
import com.example.backend.repository.LabRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorLabReportService {

    @Autowired
    private LabReportRepository labReportRepository;

    @Autowired
    private LabRequestRepository labRequestRepository;

    /**
     * 🔹 Get all lab reports (for doctor view)
     */
    public List<DoctorLabReportDto> getAllLabReports() {
        return labReportRepository.findAll().stream()
                .map(this::mapToDoctorDto)
                .collect(Collectors.toList());
    }

    /**
     * 🔹 Get lab report by LabRequest ID
     */
    public Optional<DoctorLabReportDto> getReportByLabRequestId(Integer labRequestId) {
        LabRequest labRequest = labRequestRepository.findById(labRequestId)
                .orElseThrow(() -> new RuntimeException("Lab request not found"));

        return labReportRepository.findByLabRequest(labRequest)
                .map(this::mapToDoctorDto);
    }

    /**
     * 🔹 Utility method to convert LabReport -> DoctorLabReportDto
     */
    private DoctorLabReportDto mapToDoctorDto(LabReport report) {
        LabRequest request = report.getLabRequest();
        return new DoctorLabReportDto(
                report.getId(),
                report.getReportFile(),
                report.getDateIssued(),
                report.getLabTech().getId(),
                request.getId(),
                request.getTestType(),
                request.getStatus().name(),
                request.getAppointment().getId()
        );
    }
}

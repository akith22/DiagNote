package com.example.backend.service;

import com.example.backend.dto.DoctorLabReportDto;
import com.example.backend.model.LabReport;
import com.example.backend.model.User;
import com.example.backend.repository.LabReportRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorLabReportService {

    private final LabReportRepository labReportRepository;
    private final UserRepository userRepository;

    // ✅ Updated: reports are stored directly in /uploads
    private final Path reportsDirectory = Paths.get("uploads");

    public DoctorLabReportService(LabReportRepository labReportRepository, UserRepository userRepository) {
        this.labReportRepository = labReportRepository;
        this.userRepository = userRepository;
    }

    /** ✅ Fetch all reports for the authenticated doctor */
    public List<DoctorLabReportDto> getAllLabReportsForDoctor() {
        User doctor = getAuthenticatedDoctor();

        List<LabReport> reports = labReportRepository
                .findByLabRequest_Appointment_Doctor_User_Email(doctor.getEmail());

        if (reports.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No lab reports found for this doctor.");
        }

        return reports.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /** ✅ Get single lab report by labRequestId */
    public DoctorLabReportDto getLabReportByLabRequestId(Integer labRequestId) {
        LabReport report = labReportRepository.findByLabRequest_Id(labRequestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lab report not found for the given request"));

        return mapToDto(report);
    }

    /** ✅ Download lab report file */
    public Resource getLabReportFile(String fileName) {
        try {
            Path filePath = reportsDirectory.resolve(fileName).normalize();
            if (!Files.exists(filePath)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Report file not found");
            }
            return new UrlResource(filePath.toUri());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error loading report file", e);
        }
    }

    /** ✅ Helper: Get currently logged-in doctor */
    private User getAuthenticatedDoctor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authenticated doctor not found"));
    }

    /** ✅ Mapping helper */
    private DoctorLabReportDto mapToDto(LabReport report) {
        String labTechName = report.getLabTech() != null
                ? report.getLabTech().getUser().getName()
                : "Unknown";
        String patientName = report.getLabRequest().getAppointment().getPatient() != null
                ? report.getLabRequest().getAppointment().getPatient().getUser().getName()
                : "Unknown";

        return new DoctorLabReportDto(
                report.getId(),
                report.getReportFile(),
                report.getDateIssued(),
                labTechName,
                report.getLabRequest().getId(),
                report.getLabRequest().getTestType(),
                patientName
        );
    }
}

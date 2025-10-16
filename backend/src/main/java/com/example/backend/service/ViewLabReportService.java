package com.example.backend.service;

import com.example.backend.dto.ViewLabReportDto;
import com.example.backend.model.ViewLabReport;
import com.example.backend.repository.ViewLabReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ViewLabReportService {

    @Autowired
    private ViewLabReportRepository viewLabReportRepository;

    public List<ViewLabReportDto> getLabReportsForPatient(Integer userId) {
        List<ViewLabReport> reports = viewLabReportRepository.findByPatientUserId(userId);

        if (reports.isEmpty()) {
            return List.of(); // Controller handles "No reports" message
        }

        return reports.stream().map(report -> {
            String reportFile = report.getReportFile();

            // ✅ Extract file extension (format)
            String format = reportFile != null && reportFile.contains(".")
                    ? reportFile.substring(reportFile.lastIndexOf('.') + 1).toUpperCase()
                    : "UNKNOWN";

            // ✅ Extract just the file name (no folder paths)
            String fileName = extractReportName(reportFile);

            // ✅ Return DTO with file name; frontend will use /api/patient/lab-reports/file/{fileName}
            return new ViewLabReportDto(
                    report.getId(),
                    fileName, // reportName
                    report.getDateIssued(),
                    "Uploaded by " + report.getLabTech().getUser().getName(),
                    format,
                    fileName // store just the name — not full path
            );
        }).collect(Collectors.toList());
    }

    private String extractReportName(String reportFile) {
        if (reportFile == null) return "Unknown Report";
        return reportFile.substring(reportFile.lastIndexOf('/') + 1)
                .replace("\\", "/"); // ✅ normalize Windows paths
    }
}

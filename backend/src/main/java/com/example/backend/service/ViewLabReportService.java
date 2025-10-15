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
            return List.of(); // Controller will handle "no reports" message
        }

        return reports.stream().map(report -> {
            String reportFile = report.getReportFile();
            String format = reportFile != null && reportFile.contains(".")
                    ? reportFile.substring(reportFile.lastIndexOf('.') + 1).toUpperCase()
                    : "UNKNOWN";

            return new ViewLabReportDto(
                    report.getId(),
                    extractReportName(reportFile),
                    report.getDateIssued(),
                    "Uploaded by " + report.getLabTech().getUser().getName(),
                    format,
                    reportFile
            );
        }).collect(Collectors.toList());
    }

    private String extractReportName(String reportFile) {
        if (reportFile == null) return "Unknown Report";
        return reportFile.substring(reportFile.lastIndexOf('/') + 1);
    }
}

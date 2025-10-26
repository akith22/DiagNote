package com.example.backend.dto;

import com.example.backend.model.LabReport;
import com.example.backend.model.LabRequest;

import java.time.LocalDateTime;

public class LabReportInfoDto {
    private Integer labRequestId;
    private String testType;
    private String requestStatus;
    private Integer labReportId;
    private String reportFile;
    private LocalDateTime reportDateIssued;
    private String labTechName;

    // Constructor from entities
    public LabReportInfoDto(LabRequest labRequest, LabReport labReport) {
        this.labRequestId = labRequest.getId();
        this.testType = labRequest.getTestType();
        this.requestStatus = labRequest.getStatus().name();

        if (labReport != null) {
            this.labReportId = labReport.getId();
            this.reportFile = labReport.getReportFile();
            this.reportDateIssued = labReport.getDateIssued();
            this.labTechName = labReport.getLabTech().getUser().getName();
        }
    }

    // Constructor for single query approach
    public LabReportInfoDto(Integer labRequestId, String testType, LabRequest.Status labRequestStatus,
                            Integer labReportId, String reportFile, LocalDateTime reportDateIssued,
                            String labTechName) {
        this.labRequestId = labRequestId;
        this.testType = testType;
        this.requestStatus = labRequestStatus != null ? labRequestStatus.name() : null;
        this.labReportId = labReportId;
        this.reportFile = reportFile;
        this.reportDateIssued = reportDateIssued;
        this.labTechName = labTechName;
    }

    // Getters
    public Integer getLabRequestId() { return labRequestId; }
    public String getTestType() { return testType; }
    public String getRequestStatus() { return requestStatus; }
    public Integer getLabReportId() { return labReportId; }
    public String getReportFile() { return reportFile; }
    public LocalDateTime getReportDateIssued() { return reportDateIssued; }
    public String getLabTechName() { return labTechName; }
    public boolean hasReport() { return labReportId != null; }
    public boolean isCompleted() { return "COMPLETED".equals(requestStatus); }
}
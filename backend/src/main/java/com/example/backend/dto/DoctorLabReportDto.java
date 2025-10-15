package com.example.backend.dto;

import java.time.LocalDateTime;

public class DoctorLabReportDto {

    private Integer reportId;
    private String reportFile;
    private LocalDateTime dateIssued;
    private Integer labTechId;
    private Integer labRequestId;
    private String testType;
    private String labRequestStatus;
    private Integer appointmentId;

    public DoctorLabReportDto() {}

    public DoctorLabReportDto(Integer reportId, String reportFile, LocalDateTime dateIssued,
                              Integer labTechId, Integer labRequestId, String testType,
                              String labRequestStatus, Integer appointmentId) {
        this.reportId = reportId;
        this.reportFile = reportFile;
        this.dateIssued = dateIssued;
        this.labTechId = labTechId;
        this.labRequestId = labRequestId;
        this.testType = testType;
        this.labRequestStatus = labRequestStatus;
        this.appointmentId = appointmentId;
    }

    // --- Getters & Setters ---
    public Integer getReportId() { return reportId; }
    public void setReportId(Integer reportId) { this.reportId = reportId; }

    public String getReportFile() { return reportFile; }
    public void setReportFile(String reportFile) { this.reportFile = reportFile; }

    public LocalDateTime getDateIssued() { return dateIssued; }
    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }

    public Integer getLabTechId() { return labTechId; }
    public void setLabTechId(Integer labTechId) { this.labTechId = labTechId; }

    public Integer getLabRequestId() { return labRequestId; }
    public void setLabRequestId(Integer labRequestId) { this.labRequestId = labRequestId; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public String getLabRequestStatus() { return labRequestStatus; }
    public void setLabRequestStatus(String labRequestStatus) { this.labRequestStatus = labRequestStatus; }

    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
}

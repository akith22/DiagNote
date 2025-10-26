package com.example.backend.dto;

import java.time.LocalDateTime;

public class ViewLabReportDto {
    private Integer id;
    private String reportName;
    private LocalDateTime dateIssued;
    private String uploadedBy;
    private String fileFormat;
    private String reportFile;

    public ViewLabReportDto() {}

    public ViewLabReportDto(Integer id, String reportName, LocalDateTime dateIssued, String uploadedBy, String fileFormat, String reportFile) {
        this.id = id;
        this.reportName = reportName;
        this.dateIssued = dateIssued;
        this.uploadedBy = uploadedBy;
        this.fileFormat = fileFormat;
        this.reportFile = reportFile;
    }

    // Getters / Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getReportName() { return reportName; }
    public void setReportName(String reportName) { this.reportName = reportName; }

    public LocalDateTime getDateIssued() { return dateIssued; }
    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }

    public String getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(String uploadedBy) { this.uploadedBy = uploadedBy; }

    public String getFileFormat() { return fileFormat; }
    public void setFileFormat(String fileFormat) { this.fileFormat = fileFormat; }

    public String getReportFile() { return reportFile; }
    public void setReportFile(String reportFile) { this.reportFile = reportFile; }
}

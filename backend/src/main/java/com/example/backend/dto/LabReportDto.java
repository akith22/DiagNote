package com.example.backend.dto;

import java.time.LocalDateTime;

public class LabReportDto {

    private Integer id;
    private String reportFile;
    private LocalDateTime dateIssued;
    private Integer labTechId;
    private Integer labRequestId;

    public LabReportDto() {}

    public LabReportDto(Integer id, String reportFile, LocalDateTime dateIssued, Integer labTechId, Integer labRequestId) {
        this.id = id;
        this.reportFile = reportFile;
        this.dateIssued = dateIssued;
        this.labTechId = labTechId;
        this.labRequestId = labRequestId;
    }

    // --- Getters and Setters ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getReportFile() {
        return reportFile;
    }

    public void setReportFile(String reportFile) {
        this.reportFile = reportFile;
    }

    public LocalDateTime getDateIssued() {
        return dateIssued;
    }

    public void setDateIssued(LocalDateTime dateIssued) {
        this.dateIssued = dateIssued;
    }

    public Integer getLabTechId() {
        return labTechId;
    }

    public void setLabTechId(Integer labTechId) {
        this.labTechId = labTechId;
    }

    public Integer getLabRequestId() {
        return labRequestId;
    }

    public void setLabRequestId(Integer labRequestId) {
        this.labRequestId = labRequestId;
    }
}

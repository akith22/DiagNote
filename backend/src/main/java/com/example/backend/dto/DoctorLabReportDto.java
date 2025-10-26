package com.example.backend.dto;

import java.time.LocalDateTime;

public class DoctorLabReportDto {
    private Integer id;
    private String reportFileName;
    private LocalDateTime dateIssued;
    private String labTechName;
    private Integer labRequestId;
    private String testType;
    private String patientName;

    public DoctorLabReportDto() {}

    public DoctorLabReportDto(Integer id, String reportFileName, LocalDateTime dateIssued,
                              String labTechName, Integer labRequestId,
                              String testType, String patientName) {
        this.id = id;
        this.reportFileName = reportFileName;
        this.dateIssued = dateIssued;
        this.labTechName = labTechName;
        this.labRequestId = labRequestId;
        this.testType = testType;
        this.patientName = patientName;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getReportFileName() { return reportFileName; }
    public void setReportFileName(String reportFileName) { this.reportFileName = reportFileName; }

    public LocalDateTime getDateIssued() { return dateIssued; }
    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }

    public String getLabTechName() { return labTechName; }
    public void setLabTechName(String labTechName) { this.labTechName = labTechName; }

    public Integer getLabRequestId() { return labRequestId; }
    public void setLabRequestId(Integer labRequestId) { this.labRequestId = labRequestId; }

    public String getTestType() { return testType; }
    public void setTestType(String testType) { this.testType = testType; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
}

package com.example.backend.dto;

import java.time.LocalDateTime;

public class LabRequestResponse {
    private Long requestId;
    private Integer doctorId;
    private String doctorName;
    private Integer patientId;
    private String patientName;
    private Integer labTechId;
    private String labTechName;
    private String testName;
    private String status;
    private LocalDateTime requestedAt;

    public LabRequestResponse() {}

    public LabRequestResponse(Long requestId, Integer doctorId, String doctorName,
                              Integer patientId, String patientName,
                              Integer labTechId, String labTechName,
                              String testName, String status, LocalDateTime requestedAt) {
        this.requestId = requestId;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.patientId = patientId;
        this.patientName = patientName;
        this.labTechId = labTechId;
        this.labTechName = labTechName;
        this.testName = testName;
        this.status = status;
        this.requestedAt = requestedAt;
    }

    // Getters and Setters
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public Integer getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Integer doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public Integer getPatientId() {
        return patientId;
    }

    public void setPatientId(Integer patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Integer getLabTechId() {
        return labTechId;
    }

    public void setLabTechId(Integer labTechId) {
        this.labTechId = labTechId;
    }

    public String getLabTechName() {
        return labTechName;
    }

    public void setLabTechName(String labTechName) {
        this.labTechName = labTechName;
    }

    public String getTestName() {
        return testName;
    }

    public void setTestName(String testName) {
        this.testName = testName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestedAt() {
        return requestedAt;
    }

    public void setRequestedAt(LocalDateTime requestedAt) {
        this.requestedAt = requestedAt;
    }
}

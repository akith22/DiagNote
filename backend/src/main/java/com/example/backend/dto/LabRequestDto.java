package com.example.backend.dto;

import java.time.LocalDateTime;

public class LabRequestDto {

    private Long id;
    private String patientName;
    private String patientEmail;
    private String doctorName;
    private String testName;
    private String status; // e.g., PENDING, COMPLETED
    private LocalDateTime requestedAt;

    public LabRequestDto() {}

    public LabRequestDto(Long id, String patientName, String patientEmail,
                         String doctorName, String testName,
                         String status, LocalDateTime requestedAt) {
        this.id = id;
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.doctorName = doctorName;
        this.testName = testName;
        this.status = status;
        this.requestedAt = requestedAt;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
}

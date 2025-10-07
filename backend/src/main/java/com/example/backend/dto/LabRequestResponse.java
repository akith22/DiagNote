package com.example.backend.dto;

public class LabRequestResponse {

    private Integer id;            // LabRequest ID
    private String status;         // REQUESTED or COMPLETED
    private String testType;       // The type of test requested
    private Integer appointmentId; // Reference to appointment

    public LabRequestResponse() {}

    public LabRequestResponse(Integer id, String status, String testType, Integer appointmentId) {
        this.id = id;
        this.status = status;
        this.testType = testType;
        this.appointmentId = appointmentId;
    }

    // --- Getters and Setters ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTestType() {
        return testType;
    }

    public void setTestType(String testType) {
        this.testType = testType;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }
}

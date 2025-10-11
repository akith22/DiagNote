package com.example.backend.dto;

public class DoctorLabRequestDto {

    private Integer id;
    private String status;
    private String testType;
    private Integer appointmentId;
    private String patientName;

    public DoctorLabRequestDto() {}

    public DoctorLabRequestDto(Integer id, String status, String testType, Integer appointmentId, String patientName) {
        this.id = id;
        this.status = status;
        this.testType = testType;
        this.appointmentId = appointmentId;
        this.patientName = patientName;
    }

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

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }
}

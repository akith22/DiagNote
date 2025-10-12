package com.example.backend.dto;

public class LabRequestDto {
    private Integer id;
    private String testType;
    private String status;
    private Integer appointmentId;
    private String doctorName;
    private String patientName;

    public LabRequestDto() {}

    public LabRequestDto(Integer id, String testType, String status, Integer appointmentId, String doctorName, String patientName) {
        this.id = id;
        this.testType = testType;
        this.status = status;
        this.appointmentId = appointmentId;
        this.doctorName = doctorName;
        this.patientName = patientName;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTestType() {
        return testType;
    }

    public void setTestType(String testType) {
        this.testType = testType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }
}

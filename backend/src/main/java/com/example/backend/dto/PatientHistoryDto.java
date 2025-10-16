package com.example.backend.dto;

import java.util.ArrayList;
import java.util.List;

// PatientHistoryDto.java
public class PatientHistoryDto {
    private String patientName;
    private String patientEmail;
    private String gender;
    private Integer age;
    private String address;
    private List<AppointmentPrescriptionDto> history;
    private List<LabReportDto> labReports;




    public PatientHistoryDto(String patientName, String patientEmail, String gender,
                             Integer age, String address) {
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.gender = gender;
        this.age = age;
        this.address = address;
        this.history = new ArrayList<>();
        this.labReports = new ArrayList<>();

    }

    // getters and setters

    public List<AppointmentPrescriptionDto> getHistory() { return history; }
    public void setHistory(List<AppointmentPrescriptionDto> history) { this.history = history; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getPatientEmail() { return patientEmail; }
    public void setPatientEmail(String patientEmail) { this.patientEmail = patientEmail; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public List<LabReportDto> getLabReports() {
        return labReports;
    }

    public void setLabReports(List<LabReportDto> labReports) {
        this.labReports = labReports;
    }
}
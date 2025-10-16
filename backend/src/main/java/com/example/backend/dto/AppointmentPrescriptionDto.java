package com.example.backend.dto;

import com.example.backend.model.AppointmentStatus;
import com.example.backend.model.LabRequest;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// AppointmentPrescriptionDto.java
public class AppointmentPrescriptionDto {
    private Integer appointmentId;
    private String doctorName;
    private LocalDateTime appointmentDate;
    private String status;
    private Integer prescriptionId;
    private String prescriptionNotes;
    private LocalDateTime dateIssued;
    private List<LabReportInfoDto> labReports = new ArrayList<>();

    // Constructor for JPQL
    public AppointmentPrescriptionDto(Integer appointmentId, String doctorName,
                                      LocalDateTime appointmentDate, AppointmentStatus status,
                                      Integer prescriptionId, String prescriptionNotes,
                                      LocalDateTime prescriptionDate,
                                      Integer labRequestId, String testType,
                                      LabRequest.Status labRequestStatus,
                                      Integer labReportId, String reportFile,
                                      LocalDateTime reportDate, String labTechName) {
        this.appointmentId = appointmentId;
        this.doctorName = doctorName;
        this.appointmentDate = appointmentDate;
        this.status = status != null ? status.name() : null;
        this.prescriptionId = prescriptionId;
        this.prescriptionNotes = prescriptionNotes;
        this.dateIssued = prescriptionDate;

        // Add lab report if lab request exists
        if (labRequestId != null) {
            LabReportInfoDto labReport = new LabReportInfoDto(
                    labRequestId, testType, labRequestStatus,
                    labReportId, reportFile, reportDate, labTechName
            );
            this.labReports.add(labReport);
        }
    }

    // Getters and setters
    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
    public LocalDateTime getAppointmentDate() { return appointmentDate; }
    public void setAppointmentDate(LocalDateTime appointmentDate) { this.appointmentDate = appointmentDate; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getPrescriptionId() { return prescriptionId; }
    public void setPrescriptionId(Integer prescriptionId) { this.prescriptionId = prescriptionId; }
    public String getPrescriptionNotes() { return prescriptionNotes; }
    public void setPrescriptionNotes(String prescriptionNotes) { this.prescriptionNotes = prescriptionNotes; }
    public LocalDateTime getDateIssued() { return dateIssued; }
    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }
    public boolean hasPrescription() { return prescriptionId != null; }

    // Method to add additional lab reports (for cases where one appointment has multiple lab requests)
    public void addLabReport(LabReportInfoDto labReport) {
        if (labReport != null) {
            this.labReports.add(labReport);
        }
    }
    public List<LabReportInfoDto> getLabReports() { return labReports; }

    public void setLabReports(List<LabReportInfoDto> labReports) {
        this.labReports = labReports;
    }
    public boolean hasLabReports() { return !labReports.isEmpty(); }
}
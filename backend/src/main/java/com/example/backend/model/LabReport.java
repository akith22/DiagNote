package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_report")
public class LabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "report_file", length = 255)
    private String reportFile;

    @Column(name = "date_issued")
    private LocalDateTime dateIssued;

    // 🔹 Many reports can be created by one lab technician
    @ManyToOne
    @JoinColumn(name = "lab_tech_labtech_id", nullable = false)
    private LabTech labTech;

    // 🔹 Each report corresponds to one lab request
    @OneToOne
    @JoinColumn(name = "lab_request_id", nullable = false)
    private LabRequest labRequest;

    public LabReport() {}

    public LabReport(String reportFile, LocalDateTime dateIssued, LabTech labTech, LabRequest labRequest) {
        this.reportFile = reportFile;
        this.dateIssued = dateIssued;
        this.labTech = labTech;
        this.labRequest = labRequest;
    }

    // --- Getters and Setters ---
    public Integer getId() {
        return id;
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

    public LabTech getLabTech() {
        return labTech;
    }

    public void setLabTech(LabTech labTech) {
        this.labTech = labTech;
    }

    public LabRequest getLabRequest() {
        return labRequest;
    }

    public void setLabRequest(LabRequest labRequest) {
        this.labRequest = labRequest;
    }
}

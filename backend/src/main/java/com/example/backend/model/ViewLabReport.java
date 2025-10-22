package com.example.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_report")
@DynamicInsert
@DynamicUpdate
public class ViewLabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "report_file")
    private String reportFile;

    @Column(name = "date_issued")
    private LocalDateTime dateIssued;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_tech_labtech_id", nullable = false)
    private LabTech labTech;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lab_request_id", nullable = false)
    private LabRequest labRequest;

    // Getters and Setters
    public Integer getId() { return id; }

    public void setId(Integer id) { this.id = id; }

    public String getReportFile() { return reportFile; }

    public void setReportFile(String reportFile) { this.reportFile = reportFile; }

    public LocalDateTime getDateIssued() { return dateIssued; }

    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }

    public LabTech getLabTech() { return labTech; }

    public void setLabTech(LabTech labTech) { this.labTech = labTech; }

    public LabRequest getLabRequest() { return labRequest; }

    public void setLabRequest(LabRequest labRequest) { this.labRequest = labRequest; }
}

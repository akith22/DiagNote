package com.example.backend.model;

import jakarta.persistence.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import java.time.LocalDateTime;

@Entity
@Table(name = "lab_requests")
@DynamicInsert
@DynamicUpdate
public class LabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Doctor who requested the lab test
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Patient who needs the lab test
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Lab technician who processes it (can be null until assigned)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "labtech_id")
    private LabTech labTech;

    @Column(name = "test_name", nullable = false)
    private String testName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LabRequestStatus status = LabRequestStatus.PENDING;

    @Column(name = "requested_at", nullable = false)
    private LocalDateTime requestedAt = LocalDateTime.now();

    // Constructors
    public LabRequest() {}

    public LabRequest(Doctor doctor, Patient patient, LabTech labTech,
                      String testName, LabRequestStatus status, LocalDateTime requestedAt) {
        this.doctor = doctor;
        this.patient = patient;
        this.labTech = labTech;
        this.testName = testName;
        this.status = status;
        this.requestedAt = requestedAt;
    }

    // Getters / Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Doctor getDoctor() { return doctor; }
    public void setDoctor(Doctor doctor) { this.doctor = doctor; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public LabTech getLabTech() { return labTech; }
    public void setLabTech(LabTech labTech) { this.labTech = labTech; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public LabRequestStatus getStatus() { return status; }
    public void setStatus(LabRequestStatus status) { this.status = status; }

    public LocalDateTime getRequestedAt() { return requestedAt; }
    public void setRequestedAt(LocalDateTime requestedAt) { this.requestedAt = requestedAt; }
}

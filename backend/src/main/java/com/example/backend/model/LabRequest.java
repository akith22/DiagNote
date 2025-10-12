package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lab_request")
public class LabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // enum('REQUESTED','COMPLETED')
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, columnDefinition = "ENUM('REQUESTED','COMPLETED') DEFAULT 'REQUESTED'")
    private Status status = Status.REQUESTED;

    // test_type column in DB
    @Column(name = "test_type", length = 45)
    private String testType;

    // Foreign key to appointments table
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointments_id", nullable = false)
    private Appointment appointment;

    // --- Enum for status ---
    public enum Status {
        REQUESTED,
        COMPLETED
    }

    // --- Constructors ---
    public LabRequest() {
    }

    public LabRequest(Status status, String testType, Appointment appointment) {
        this.status = status;
        this.testType = testType;
        this.appointment = appointment;
    }

    // --- Getters and Setters ---
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getTestType() {
        return testType;
    }

    public void setTestType(String testType) {
        this.testType = testType;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
    }
}

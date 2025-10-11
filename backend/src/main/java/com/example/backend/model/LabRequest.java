package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lab_request")
public class LabRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.REQUESTED;

    @Column(name = "test_type", length = 45, nullable = false)
    private String testType;

    @ManyToOne
    @JoinColumn(name = "appointments_id", nullable = false)
    private Appointment appointment;

    public enum Status {
        REQUESTED,
        COMPLETED
    }

    // Getters and Setters
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

package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String notes;

    @Column(name = "date_issued", nullable = false)
    private LocalDateTime dateIssued;

    // 🔧 Changed from Long to Integer to match Appointment.id
    @Column(name = "appointment_id", nullable = false)
    private Integer appointmentId;

    public Prescription() {}

    public Prescription(String notes, LocalDateTime dateIssued, Integer appointmentId) {
        this.notes = notes;
        this.dateIssued = dateIssued;
        this.appointmentId = appointmentId;
    }

    // ✅ Getters and setters
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getDateIssued() {
        return dateIssued;
    }

    public void setDateIssued(LocalDateTime dateIssued) {
        this.dateIssued = dateIssued;
    }

    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }
}

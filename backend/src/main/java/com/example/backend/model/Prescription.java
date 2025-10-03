package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescription")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "notes", length = 4000)
    private String notes;

    @Column(name = "date_issued")
    private LocalDateTime dateIssued;

    @Column(name = "appointments_id", nullable = false)
    private Long appointmentId;

    public Prescription() {}

    public Prescription(String notes, LocalDateTime dateIssued, Long appointmentId) {
        this.notes = notes;
        this.dateIssued = dateIssued;
        this.appointmentId = appointmentId;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getDateIssued() { return dateIssued; }
    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }
}
package com.example.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescription")
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // DB column limited to 255 chars as per your screenshot
    @Column(name = "notes", length = 255)
    private String notes;

    @Column(name = "date_issued")
    private LocalDateTime dateIssued;

    // link to appointments table (appointments_id)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointments_id", nullable = false)
    private Appointment appointment;

    public Prescription() {}

    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getDateIssued() { return dateIssued; }
    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }

    public Appointment getAppointment() { return appointment; }
    public void setAppointment(Appointment appointment) { this.appointment = appointment; }
}

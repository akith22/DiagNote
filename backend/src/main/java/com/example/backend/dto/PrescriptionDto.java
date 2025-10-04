package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

public class PrescriptionDto {

    private Integer id;

    @NotBlank(message = "Notes are required")
    private String notes;

    private LocalDateTime dateIssued;

    private Integer appointmentId;

    public PrescriptionDto() {}

    // Getters and setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getDateIssued() { return dateIssued; }
    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }

    public Integer getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Integer appointmentId) { this.appointmentId = appointmentId; }
}

package com.example.backend.dto;

import java.time.LocalDateTime;

public class PrescriptionDto {
    private Integer id;
    private Long appointmentId;
    private LocalDateTime dateIssued;
    private String notesJson;  // contains all prescription details

    public PrescriptionDto() {}

    public PrescriptionDto(Integer id, Long appointmentId, LocalDateTime dateIssued, String notesJson) {
        this.id = id;
        this.appointmentId = appointmentId;
        this.dateIssued = dateIssued;
        this.notesJson = notesJson;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Long getAppointmentId() { return appointmentId; }
    public void setAppointmentId(Long appointmentId) { this.appointmentId = appointmentId; }

    public LocalDateTime getDateIssued() { return dateIssued; }
    public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }

    public String getNotesJson() { return notesJson; }
    public void setNotesJson(String notesJson) { this.notesJson = notesJson; }
}
package com.example.backend.dto;

import com.example.backend.model.Appointment;

import java.time.LocalDateTime;

public class AppointmentDto {

    private Long id;
    private LocalDateTime date;
    private Appointment.Status status;
    private Long patientId;
    private String patientName;
    private Long doctorId;

    public AppointmentDto() {}

    public AppointmentDto(Long id, LocalDateTime date, Appointment.Status status,
                          Long patientId, String patientName, Long doctorId) {
        this.id = id;
        this.date = date;
        this.status = status;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public Appointment.Status getStatus() { return status; }
    public void setStatus(Appointment.Status status) { this.status = status; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getDoctorId() { return doctorId; }
    public void setDoctorId(Long doctorId) { this.doctorId = doctorId; }
}

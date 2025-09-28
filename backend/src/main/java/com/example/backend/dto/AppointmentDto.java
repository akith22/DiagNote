package com.example.backend.dto;

import com.example.backend.model.Appointment;
import com.example.backend.model.AppointmentStatus;

import java.time.LocalDateTime;

public class AppointmentDto {

    private Integer id;
    private LocalDateTime date;
    private AppointmentStatus status;
    private Integer patientId;
    private String patientName;
    private Integer doctorId;

    public AppointmentDto() {}

    public AppointmentDto(Integer id, LocalDateTime date, AppointmentStatus status,
                          Integer patientId, String patientName, Integer doctorId) {
        this.id = id;
        this.date = date;
        this.status = status;
        this.patientId = patientId;
        this.patientName = patientName;
        this.doctorId = doctorId;
    }

    // Getters & Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }

    public AppointmentStatus getStatus() { return status; }
    public void setStatus(AppointmentStatus status) { this.status = status; }

    public Integer getPatientId() { return patientId; }
    public void setPatientId(Integer patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }
}

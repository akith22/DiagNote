package com.example.backend.dto;

import java.time.LocalDateTime;

public class AppointmentRequest {
    private Integer doctorId;
    private String patientEmail;
    private LocalDateTime appointmentDateTime;

    public Integer getDoctorId() { return doctorId; }
    public void setDoctorId(Integer doctorId) { this.doctorId = doctorId; }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientId(String patientEmail) { this.patientEmail = patientEmail; }

    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }

}

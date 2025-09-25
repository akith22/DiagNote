package com.example.backend.dto;

import java.time.LocalDateTime;

public class AppointmentRequest {
    private String doctorEmail;
    private String patientEmail;
    private LocalDateTime appointmentDateTime;

    public String getDoctorEmail() {
        return doctorEmail;
    }

    public void setDoctorEmail(String doctorEmail) {
        this.doctorEmail = doctorEmail;
    }

    public String getPatientEmail() { return patientEmail; }
    public void setPatientId(String patientEmail) { this.patientEmail = patientEmail; }

    public LocalDateTime getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(LocalDateTime appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }

}

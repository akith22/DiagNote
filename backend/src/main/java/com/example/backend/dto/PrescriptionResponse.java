package com.example.backend.dto;

import java.time.LocalDateTime;

public class PrescriptionResponse {
    private Integer id;
    private String notes;
    private LocalDateTime dateIssued;
    private AppointmentInfo appointment;

    public PrescriptionResponse() {}

    public PrescriptionResponse(Integer id, String notes, LocalDateTime dateIssued, AppointmentInfo appointment) {
        this.id = id;
        this.notes = notes;
        this.dateIssued = dateIssued;
        this.appointment = appointment;
    }

    // Getters and Setters
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

    public AppointmentInfo getAppointment() {
        return appointment;
    }

    public void setAppointment(AppointmentInfo appointment) {
        this.appointment = appointment;
    }

    public static class AppointmentInfo {
        private Integer id;
        private String date;
        private String time;
        private DoctorInfo doctor;

        public AppointmentInfo() {}

        public AppointmentInfo(Integer id, String date, String time, DoctorInfo doctor) {
            this.id = id;
            this.date = date;
            this.time = time;
            this.doctor = doctor;
        }

        // Getters and Setters
        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }

        public DoctorInfo getDoctor() {
            return doctor;
        }

        public void setDoctor(DoctorInfo doctor) {
            this.doctor = doctor;
        }
    }

    public static class DoctorInfo {
        private String name;
        private String specialization;

        public DoctorInfo() {}

        public DoctorInfo(String name, String specialization) {
            this.name = name;
            this.specialization = specialization;
        }

        // Getters and Setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getSpecialization() {
            return specialization;
        }

        public void setSpecialization(String specialization) {
            this.specialization = specialization;
        }
    }
}

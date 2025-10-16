package com.example.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DoctorPatientHistoryDto {

    private String name;
    private String email;
    private String gender;
    private Integer age;
    private String address;

    private List<AppointmentInfo> appointments;
    private List<PrescriptionInfo> prescriptions;

    public DoctorPatientHistoryDto(String name, String email, String gender, Integer age, String address) {
        this.name = name;
        this.email = email;
        this.gender = gender;
        this.age = age;
        this.address = address;
    }

    // Inner DTOs
    public static class AppointmentInfo {
        private Integer id;
        private String doctorName;
        private LocalDateTime date;
        private String status;

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

        public LocalDateTime getDate() { return date; }
        public void setDate(LocalDateTime date) { this.date = date; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public static class PrescriptionInfo {
        private Integer id;
        private String doctorName;
        private String notes;
        private LocalDateTime dateIssued;

        public Integer getId() { return id; }
        public void setId(Integer id) { this.id = id; }

        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }

        public LocalDateTime getDateIssued() { return dateIssued; }
        public void setDateIssued(LocalDateTime dateIssued) { this.dateIssued = dateIssued; }
    }

    // Getters / Setters for main fields
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public List<AppointmentInfo> getAppointments() { return appointments; }
    public void setAppointments(List<AppointmentInfo> appointments) { this.appointments = appointments; }

    public List<PrescriptionInfo> getPrescriptions() { return prescriptions; }
    public void setPrescriptions(List<PrescriptionInfo> prescriptions) { this.prescriptions = prescriptions; }
}

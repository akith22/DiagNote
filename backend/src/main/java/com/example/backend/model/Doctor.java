package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor")
public class Doctor {

    @Id
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String specilization;
    private String licenseNumber;

    @Column(length = 1000)
    private String availableTimes;
    // Constructors
    public Doctor() {}

    public Doctor(Integer id, User user, String specialization, String licenseNumber, String availableTimes) {
        this.id = id;
        this.user = user;
        this.specilization = specialization;
        this.licenseNumber = licenseNumber;
        this.availableTimes = availableTimes;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSpecialization() {
        return specilization;
    }

    public void setSpecialization(String specialization) {
        this.specilization = specialization;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getAvailableTimes() {
        return availableTimes;
    }

    public void setAvailableTimes(String availableTimes) {
        this.availableTimes = availableTimes;
    }
}

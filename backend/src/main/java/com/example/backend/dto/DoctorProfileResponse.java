package com.example.backend.dto;

public class DoctorProfileResponse {
    private String name;
    private String email;
    private String specialization;
    private String licenseNumber;
    private String availableTimes;
    private boolean profileComplete;

    public DoctorProfileResponse() {}

    public DoctorProfileResponse(String name, String email, String specialization, String licenseNumber, String availableTimes, boolean profileComplete) {
        this.name = name;
        this.email = email;
        this.specialization = specialization;
        this.licenseNumber = licenseNumber;
        this.availableTimes = availableTimes;
        this.profileComplete = profileComplete;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
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

    public boolean isProfileComplete() {
        return profileComplete;
    }

    public void setProfileComplete(boolean profileComplete) {
        this.profileComplete = profileComplete;
    }
}

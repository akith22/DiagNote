package com.example.backend.dto;

public class DoctorDetailsDto {
    private String specialization;
    private String licenseNumber;
    private String availableTimes;

    public DoctorDetailsDto() {}

    public DoctorDetailsDto(String specialization, String licenseNumber, String availableTimes) {
        this.specialization = specialization;
        this.licenseNumber = licenseNumber;
        this.availableTimes = availableTimes;
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
}

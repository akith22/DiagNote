package com.example.backend.dto;

public class LabTechDetailsDto {
    private String department;

    // Constructors
    public LabTechDetailsDto() {}

    public LabTechDetailsDto(String department) {
        this.department = department;
    }

    // Getters and Setters
    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}

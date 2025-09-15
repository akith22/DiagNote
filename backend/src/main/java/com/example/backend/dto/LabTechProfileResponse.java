package com.example.backend.dto;

public class LabTechProfileResponse {
    private String name;
    private String email;
    private String department;
    private boolean profileComplete;

    // Constructors
    public LabTechProfileResponse() {}

    public LabTechProfileResponse(String name, String email, String department, boolean profileComplete) {
        this.name = name;
        this.email = email;
        this.department = department;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public boolean isProfileComplete() {
        return profileComplete;
    }

    public void setProfileComplete(boolean profileComplete) {
        this.profileComplete = profileComplete;
    }
}

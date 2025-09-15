package com.example.backend.dto;

public class PatientProfileResponse {
    private String name;
    private String email;
    private String gender;
    private String address;
    private Integer age;
    private boolean profileComplete;

    // Constructors
    public PatientProfileResponse() {}

    public PatientProfileResponse(String name, String email, String gender, String address, Integer age, boolean profileComplete) {
        this.name = name;
        this.email = email;
        this.gender = gender;
        this.address = address;
        this.age = age;
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

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public boolean isProfileComplete() {
        return profileComplete;
    }

    public void setProfileComplete(boolean profileComplete) {
        this.profileComplete = profileComplete;
    }
}

package com.example.backend.dto;

public class PatientDetailsDto {
    private String gender;
    private String address;
    private Integer age;

    // Constructors
    public PatientDetailsDto() {}

    public PatientDetailsDto(String gender, String address, Integer age) {
        this.gender = gender;
        this.address = address;
        this.age = age;
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
}

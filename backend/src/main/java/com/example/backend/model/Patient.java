package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "patient")
public class Patient {

    @Id
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String gender;
    private String address;
    private Integer age;

    // Constructors
    public Patient() {}

    public Patient(Integer id, User user, String gender, String address, Integer age) {
        this.id = id;
        this.user = user;
        this.gender = gender;
        this.address = address;
        this.age = age;
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

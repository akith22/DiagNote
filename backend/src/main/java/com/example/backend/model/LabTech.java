package com.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "lab_tech")
public class LabTech {

    @Id
    private Integer id;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    private String department;

    // Constructors
    public LabTech() {}

    public LabTech(Integer id, User user, String department) {
        this.id = id;
        this.user = user;
        this.department = department;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}

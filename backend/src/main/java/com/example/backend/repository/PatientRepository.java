package com.example.backend.repository;

import com.example.backend.model.Doctor;
import com.example.backend.model.Patient;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByUserUserId(Integer userId);

    Optional<Patient> findByUser(User user);

    Boolean existsByUser(User user);

    void deleteByUser(User user);

    Optional<Patient> findByUser_Email(String email);

}

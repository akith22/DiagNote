package com.example.backend.repository;

import com.example.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {

    @Query("SELECT p FROM Prescription p WHERE p.appointment.patient.id = :patientId")
    List<Prescription> findAllByPatientId(Integer patientId);
}

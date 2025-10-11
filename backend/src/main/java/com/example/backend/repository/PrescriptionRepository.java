package com.example.backend.repository;

import com.example.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {

    // Return all prescriptions for a given appointment
    List<Prescription> findByAppointment_Id(Integer appointmentId);

    Optional<List<Prescription>> findPrescriptionsByAppointment_Doctor_User_Email(String doctorEmail);

    @Query("SELECT p FROM Prescription p WHERE p.appointment.patient.id = :patientId")
    List<Prescription> findAllByPatientId(Integer patientId);
}

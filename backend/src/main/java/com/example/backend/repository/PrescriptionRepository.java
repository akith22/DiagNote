package com.example.backend.repository;

import com.example.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {

    /**
     * Find all prescriptions for a given appointment
     */
    List<Prescription> findByAppointmentId(Long appointmentId);

    /**
     * Find all prescriptions for a list of appointment IDs
     */
    List<Prescription> findByAppointmentIdIn(List<Long> appointmentIds);

    /**
     * Optional: Find all prescriptions directly by doctor ID via appointments
     * This requires a JPQL query
     */
    // @Query("SELECT p FROM Prescription p JOIN Appointment a ON p.appointmentId = a.id WHERE a.doctorId = :doctorId")
    // List<Prescription> findByDoctorId(@Param("doctorId") Long doctorId);
}

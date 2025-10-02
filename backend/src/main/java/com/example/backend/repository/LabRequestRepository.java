package com.example.backend.repository;

import com.example.backend.model.LabRequest;
import com.example.backend.model.LabTech;
import com.example.backend.model.Patient;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabRequestRepository extends JpaRepository<LabRequest, Long> {

    // Find all lab requests for a specific lab tech
    List<LabRequest> findByLabTech(LabTech labTech);

    // Find all lab requests for a specific patient
    List<LabRequest> findByPatient(Patient patient);

    // Find all lab requests created by a specific doctor
    List<LabRequest> findByDoctor(User doctor);

    // Optionally, find by status
    List<LabRequest> findByStatus(String status);

    // Find lab request by ID and lab tech
    Optional<LabRequest> findByIdAndLabTech(Long id, LabTech labTech);

    // Find lab request by ID and patient
    Optional<LabRequest> findByIdAndPatient(Long id, Patient patient);

    // Find lab requests assigned to a lab tech and status
    List<LabRequest> findByLabTechAndStatus(LabTech labTech, String status);

    List<LabRequest> findByPatientId(Integer userId);
}

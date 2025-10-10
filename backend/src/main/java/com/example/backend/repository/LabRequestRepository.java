package com.example.backend.repository;

import com.example.backend.model.Appointment;
import com.example.backend.model.LabRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LabRequestRepository extends JpaRepository<LabRequest, Integer> {

    // Existing method
    List<LabRequest> findByAppointment(Appointment appointment);

    // New method: find all lab requests for a doctor by email
    Optional<List<LabRequest>> findByAppointment_Doctor_User_Email(String email);
}

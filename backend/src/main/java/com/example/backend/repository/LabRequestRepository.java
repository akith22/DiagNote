package com.example.backend.repository;

import com.example.backend.model.LabRequest;
import com.example.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LabRequestRepository extends JpaRepository<LabRequest, Integer> {

    // Find all lab requests by status (REQUESTED or COMPLETED)
    List<LabRequest> findByStatus(LabRequest.Status status);

    // Find all lab requests by test type
    List<LabRequest> findByTestType(String testType);

    // Find all lab requests linked to a specific appointment
    List<LabRequest> findByAppointment(Appointment appointment);

    // Find all lab requests for an appointment ID
    List<LabRequest> findByAppointmentId(Integer appointmentId);

    Optional<List<LabRequest>> findByAppointment_Doctor_User_Email(String email);


}

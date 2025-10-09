package com.example.backend.repository;

import com.example.backend.model.LabRequest;
import com.example.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LabRequestRepository extends JpaRepository<LabRequest, Integer> {
    List<LabRequest> findByAppointment(Appointment appointment);
}

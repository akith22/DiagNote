package com.example.backend.repository;

import com.example.backend.model.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, Integer> {
    List<Prescription> findByAppointmentId(Integer appointmentId); // 🔧 Fixed: Long → Integer
}

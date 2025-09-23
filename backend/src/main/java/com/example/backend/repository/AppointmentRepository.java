package com.example.backend.repository;

import com.example.backend.model.Appointment;
import com.example.backend.model.Appointment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByDoctorIdAndStatus(Long doctorId, Status status);

    List<Appointment> findByDoctorIdAndDateAfterOrderByDateAsc(Long doctorId, LocalDateTime from);

    List<Appointment> findByDoctorIdAndDateBeforeOrderByDateDesc(Long doctorId, LocalDateTime to);

    // Pending appointments for a doctor
    List<Appointment> findByDoctorIdAndStatusOrderByDateAsc(Long doctorId, Status status);

    // Optionally find upcoming accepted
    List<Appointment> findByDoctorIdAndStatusAndDateAfterOrderByDateAsc(Long doctorId, Status status, LocalDateTime from);
}

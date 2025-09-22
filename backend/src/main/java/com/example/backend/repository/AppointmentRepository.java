package com.example.backend.repository;

import com.example.backend.model.Appointment;
import com.example.backend.model.Appointment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Filter by doctor and between two dates
    List<Appointment> findByDoctorIdAndDateBetween(Long doctorId, LocalDateTime start, LocalDateTime end);

    // Filter by doctor and status
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, Status status);

    // Filter by doctor, status, and between dates
    List<Appointment> findByDoctorIdAndStatusAndDateBetween(Long doctorId, Status status, LocalDateTime start, LocalDateTime end);

    // Custom query for month
    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND MONTH(a.date) = :month AND YEAR(a.date) = :year")
    List<Appointment> findByDoctorAndMonth(Long doctorId, int month, int year);

    // Custom query for week
    @Query("SELECT a FROM Appointment a WHERE a.doctorId = :doctorId AND FUNCTION('WEEK', a.date) = :week AND YEAR(a.date) = :year")
    List<Appointment> findByDoctorAndWeek(Long doctorId, int week, int year);
}

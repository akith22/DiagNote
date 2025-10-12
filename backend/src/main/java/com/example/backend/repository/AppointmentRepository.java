package com.example.backend.repository;

import com.example.backend.model.Appointment;
import com.example.backend.model.AppointmentStatus;
import com.example.backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;


public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    boolean existsByDoctorAndAppointmentDateTime(Doctor doctor, LocalDateTime appointmentDateTime);

    List<Appointment> findByDoctorIdAndStatusIn(Integer doctorId, List<AppointmentStatus> statuses);

    List<Appointment> findByPatientIdAndStatusIn(Integer patientId, List<AppointmentStatus> statuses);

    List<Appointment> findByDoctorId(Integer doctorId);

    List<Appointment> findByPatientId(Integer patientId);

    List<Appointment> findByDoctorIdAndStatus(Integer doctorId, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(Integer doctorId, LocalDateTime appointmentDateTime);
    List<Appointment> findByDoctorIdAndAppointmentDateTimeBeforeOrderByAppointmentDateTimeDesc(Integer doctorId, LocalDateTime appointmentDateTime);

    // Pending appointments for a doctor
    List<Appointment> findByDoctorIdAndStatusOrderByAppointmentDateTimeAsc(Integer doctorId, AppointmentStatus status);

    // Optionally find upcoming accepted
    List<Appointment> findByDoctorIdAndStatusAndAppointmentDateTimeAfterOrderByAppointmentDateTimeAsc(Integer doctorId, AppointmentStatus status, LocalDateTime from);
}
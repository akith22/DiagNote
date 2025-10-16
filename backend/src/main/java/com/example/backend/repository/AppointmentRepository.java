package com.example.backend.repository;

import com.example.backend.dto.AppointmentPrescriptionDto;
import com.example.backend.dto.DoctorPatientHistoryDto;
import com.example.backend.dto.PatientHistoryDto;
import com.example.backend.model.Appointment;
import com.example.backend.model.AppointmentStatus;
import com.example.backend.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


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

    Optional<List<Appointment>> findByPatient_Id(Integer patientId);


    @Query("SELECT new com.example.backend.dto.PatientHistoryDto(" +
            "p.user.name, p.user.email, p.gender, p.age, p.address) " +
            "FROM Patient p WHERE p.id = :patientId")
    PatientHistoryDto findPatientBasicInfo(@Param("patientId") Integer patientId);

    // Single query to get everything
    @Query("SELECT new com.example.backend.dto.AppointmentPrescriptionDto(" +
            "a.id, d.user.name, a.appointmentDateTime, a.status, " +
            "pr.id, pr.notes, pr.dateIssued, " +
            "lr.id, lr.testType, lr.status, " +
            "lrep.id, lrep.reportFile, lrep.dateIssued, lt.user.name) " +
            "FROM Appointment a " +
            "LEFT JOIN a.doctor d " +
            "LEFT JOIN d.user " +  // Explicit join for doctor's user name
            "LEFT JOIN Prescription pr ON pr.appointment.id = a.id " +
            "LEFT JOIN LabRequest lr ON lr.appointment.id = a.id " +  // LEFT JOIN to include appointments without lab requests
            "LEFT JOIN LabReport lrep ON lrep.labRequest.id = lr.id " + // LEFT JOIN to include lab requests without reports
            "LEFT JOIN lrep.labTech lt " +  // LEFT JOIN since lrep might be null
            "LEFT JOIN lt.user " +  // LEFT JOIN since lt might be null
            "WHERE a.patient.id = :patientId " +
            "ORDER BY a.appointmentDateTime DESC")
    List<AppointmentPrescriptionDto> findCompletePatientHistory(@Param("patientId") Integer patientId);


}
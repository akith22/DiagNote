package com.example.backend.service;

import com.example.backend.model.Appointment;
import com.example.backend.model.Doctor;
import com.example.backend.model.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DoctorAppointmentService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorAppointmentService(DoctorRepository doctorRepository,
                                    UserRepository userRepository,
                                    AppointmentRepository appointmentRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // 🔹 Availability Methods
    public String getAvailableTimes() {
        Doctor doctor = getLoggedInDoctor();
        return doctor.getAvailableTimes();
    }

    public Doctor updateAvailableTimes(String availableTimes) {
        Doctor doctor = getLoggedInDoctor();
        doctor.setAvailableTimes(availableTimes);
        return doctorRepository.save(doctor);
    }

    public void clearAvailableTimes() {
        Doctor doctor = getLoggedInDoctor();
        doctor.setAvailableTimes(null);
        doctorRepository.save(doctor);
    }

    // 🔹 Appointment Filtering
/*
    // By Status
    public List<Appointment> getAppointmentsByStatus(Appointment.Status status) {
        Long doctorId = getLoggedInDoctor().getId().longValue();
        return appointmentRepository.findByDoctorIdAndStatus(doctorId, status);
    }

    // By Time Range
    public List<Appointment> getAppointmentsByTimeRange(LocalDateTime start, LocalDateTime end) {
        Long doctorId = getLoggedInDoctor().getId().longValue();
        return appointmentRepository.findByDoctorIdAndDateBetween(doctorId, start, end);
    }

    // By Month
    public List<Appointment> getAppointmentsByMonth(int month, int year) {
        Long doctorId = getLoggedInDoctor().getId().longValue();
        return appointmentRepository.findByDoctorAndMonth(doctorId, month, year);
    }

    // By Week
    public List<Appointment> getAppointmentsByWeek(int week, int year) {
        Long doctorId = getLoggedInDoctor().getId().longValue();
        return appointmentRepository.findByDoctorAndWeek(doctorId, week, year);
    }

    // By Status + Time Range
    public List<Appointment> getAppointmentsByStatusAndTimeRange(Appointment.Status status,
                                                                 LocalDateTime start,
                                                                 LocalDateTime end) {
        Long doctorId = getLoggedInDoctor().getId().longValue();
        return appointmentRepository.findByDoctorIdAndStatusAndDateBetween(doctorId, status, start, end);
    }*/

    // 🔹 Helper to get logged-in doctor
    private Doctor getLoggedInDoctor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // email from JWT
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found for user: " + username));
    }
}

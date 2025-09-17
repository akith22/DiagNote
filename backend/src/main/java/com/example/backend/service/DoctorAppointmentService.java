package com.example.backend.service;

import com.example.backend.model.Doctor;
import com.example.backend.model.User;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class DoctorAppointmentService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public DoctorAppointmentService(DoctorRepository doctorRepository, UserRepository userRepository) {
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository;
    }

    // Get logged-in doctor's availability
    public String getAvailableTimes() {
        Doctor doctor = getLoggedInDoctor();
        return doctor.getAvailableTimes();
    }

    // Update/set availability
    public Doctor updateAvailableTimes(String availableTimes) {
        Doctor doctor = getLoggedInDoctor();
        doctor.setAvailableTimes(availableTimes);
        return doctorRepository.save(doctor);
    }

    // Clear availability
    public void clearAvailableTimes() {
        Doctor doctor = getLoggedInDoctor();
        doctor.setAvailableTimes(null);
        doctorRepository.save(doctor);
    }

    // Helper: fetch doctor from current JWT-authenticated user
    private Doctor getLoggedInDoctor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName(); // email from JWT
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        return doctorRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Doctor not found for user: " + username));
    }
}

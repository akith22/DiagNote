package com.example.backend.service;

import com.example.backend.dto.DoctorDetailsDto;
import com.example.backend.dto.DoctorProfileResponse;
import com.example.backend.model.Doctor;
import com.example.backend.model.User;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    public DoctorProfileResponse getDoctorProfile() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Doctor> doctorOpt = doctorRepository.findByUser(user);

        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            return new DoctorProfileResponse(
                    user.getName(),
                    user.getEmail(),
                    doctor.getSpecialization(),
                    doctor.getLicenseNumber(),
                    doctor.getAvailableTimes(),
                    true
            );
        } else {
            return new DoctorProfileResponse(
                    user.getName(),
                    user.getEmail(),
                    null,
                    null,
                    null,
                    false
            );
        }
    }

    @Transactional
    public void saveOrUpdateDoctorDetails(DoctorDetailsDto doctorDetailsDto) {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<Doctor> existingDoctor = doctorRepository.findByUser(user);

        Doctor doctor;
        if (existingDoctor.isPresent()) {
            doctor = existingDoctor.get();
        } else {
            doctor = new Doctor();
            doctor.setUser(user); // This sets the ID to match user ID
        }

        doctor.setSpecialization(doctorDetailsDto.getSpecialization());
        doctor.setLicenseNumber(doctorDetailsDto.getLicenseNumber());
        doctor.setAvailableTimes(doctorDetailsDto.getAvailableTimes());

        doctorRepository.save(doctor);
    }

    @Transactional
    public void deleteDoctorProfile() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        doctorRepository.deleteByUser(user);
    }
}

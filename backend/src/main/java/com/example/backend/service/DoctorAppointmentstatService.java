package com.example.backend.service;

import com.example.backend.dto.AppointmentDto;
import com.example.backend.exception.AppointmentNotFoundException;
import com.example.backend.model.Appointment;
import com.example.backend.model.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DoctorAppointmentstatService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get the currently authenticated user from Spring Security context
     */
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;

        String email = auth.getName(); // JWT username = email
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Get authenticated doctor ID
     */
    public Integer getAuthenticatedDoctorId() {
        User doctor = getAuthenticatedUser();
        if (doctor == null) throw new RuntimeException("User not authenticated");
        return doctor.getUserId(); // <-- replace with your actual User ID getter
    }

    /**
     * Get all appointments for the authenticated doctor
     * Optional filter by status: PENDING, CONFIRMED, CANCELLED, etc.
     */
    public List<AppointmentDto> getAppointmentsForAuthenticatedDoctor(Optional<String> statusFilter) {
        Integer doctorId = getAuthenticatedDoctorId();
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId.longValue());

        if (statusFilter.isPresent()) {
            String status = statusFilter.get().toUpperCase();
            appointments.removeIf(a -> !a.getStatus().name().equals(status));
        }

        List<AppointmentDto> dtoList = new ArrayList<>();
        for (Appointment a : appointments) {
            dtoList.add(mapToDto(a));
        }
        return dtoList;
    }

    /**
     * Accept an appointment
     */
    public AppointmentDto acceptAppointment(Long appointmentId, Integer doctorId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        if (!appt.getDoctorId().equals(doctorId.longValue())) {
            throw new RuntimeException("You are not authorized to accept this appointment");
        }

        appt.setStatus(Appointment.Status.CONFIRMED);
        appointmentRepository.save(appt);
        return mapToDto(appt);
    }

    /**
     * Decline an appointment
     */
    public AppointmentDto declineAppointment(Long appointmentId, Integer doctorId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        if (!appt.getDoctorId().equals(doctorId.longValue())) {
            throw new RuntimeException("You are not authorized to decline this appointment");
        }

        appt.setStatus(Appointment.Status.CANCELLED);
        appointmentRepository.save(appt);
        return mapToDto(appt);
    }

    /**
     * Map Appointment entity to DTO
     */
    private AppointmentDto mapToDto(Appointment a) {
        String patientName = "";
        if (a.getPatientId() != null) {
            User patient = userRepository.findById(a.getPatientId().intValue()).orElse(null);
            if (patient != null) {
                patientName = patient.getName(); // <-- replace with your actual User name getter
            }
        }

        return new AppointmentDto(
                a.getId(),
                a.getDate(),
                a.getStatus(),
                a.getPatientId(),
                patientName,
                a.getDoctorId()
        );
    }
}

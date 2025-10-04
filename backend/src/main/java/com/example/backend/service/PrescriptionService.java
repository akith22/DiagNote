package com.example.backend.service;

import com.example.backend.dto.PrescriptionDto;
import com.example.backend.exception.PrescriptionException;
import com.example.backend.exception.PrescriptionNotFoundException;
import com.example.backend.model.Appointment;
import com.example.backend.model.Prescription;
import com.example.backend.model.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.PrescriptionRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
@Transactional
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    /**
     * Create prescription and mark appointment as COMPLETED
     */
    public PrescriptionDto createPrescription(Long appointmentId, String notesJson) {
        if (notesJson == null || notesJson.trim().isEmpty())
            throw new PrescriptionException("Prescription details (notesJson) are required.");

        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new PrescriptionException("Appointment not found."));

        // Ensure appointment is CONFIRMED before prescribing
        if (appt.getStatus() == null || !appt.getStatus().name().equalsIgnoreCase("CONFIRMED"))
            throw new PrescriptionException("Cannot add prescription: appointment is not CONFIRMED.");

        User doctor = getAuthenticatedUser();
        if (doctor == null) throw new PrescriptionException("Doctor must be authenticated.");
        if (!appt.getDoctorId().equals(doctor.getUserId().longValue()))
            throw new PrescriptionException("Not authorized to add prescription for this appointment.");

        // 1️⃣ Create the prescription
        Prescription pres = new Prescription(notesJson, LocalDateTime.now(), appointmentId);
        Prescription saved = prescriptionRepository.save(pres);

        // 2️⃣ Update appointment status to COMPLETED using enum
        appt.setStatus(Appointment.Status.COMPLETED);
        appointmentRepository.save(appt);

        return new PrescriptionDto(saved.getId(), saved.getAppointmentId(), saved.getDateIssued(), saved.getNotes());
    }

    // Update prescription
    public PrescriptionDto updatePrescription(Integer prescriptionId, String notesJson) {
        if (notesJson == null || notesJson.trim().isEmpty())
            throw new PrescriptionException("Prescription details (notesJson) are required.");

        Prescription pres = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new PrescriptionNotFoundException("Prescription not found."));

        Appointment appt = appointmentRepository.findById(pres.getAppointmentId())
                .orElseThrow(() -> new PrescriptionException("Appointment linked to prescription not found."));

        User doctor = getAuthenticatedUser();
        if (doctor == null) throw new PrescriptionException("Doctor must be authenticated.");
        if (!appt.getDoctorId().equals(doctor.getUserId().longValue()))
            throw new PrescriptionException("Not authorized to update this prescription.");

        pres.setNotes(notesJson);
        pres.setDateIssued(LocalDateTime.now());
        Prescription updated = prescriptionRepository.save(pres);

        return new PrescriptionDto(updated.getId(), updated.getAppointmentId(), updated.getDateIssued(), updated.getNotes());
    }

    // Get latest prescription by appointment
    public PrescriptionDto getPrescriptionByAppointment(Long appointmentId) {
        List<Prescription> list = prescriptionRepository.findByAppointmentId(appointmentId);
        if (list == null || list.isEmpty())
            throw new PrescriptionNotFoundException("No prescription for this appointment.");

        list.sort(Comparator.comparing(Prescription::getDateIssued).reversed());
        Prescription p = list.get(0);

        return new PrescriptionDto(p.getId(), p.getAppointmentId(), p.getDateIssued(), p.getNotes());
    }

    // List prescriptions
    public List<PrescriptionDto> listByAppointment(Long appointmentId) {
        List<Prescription> list = prescriptionRepository.findByAppointmentId(appointmentId);
        List<PrescriptionDto> out = new ArrayList<>();
        for (Prescription p : list) {
            out.add(new PrescriptionDto(p.getId(), p.getAppointmentId(), p.getDateIssued(), p.getNotes()));
        }
        return out;
    }


    /**
     * List all prescriptions created by a specific doctor
     */
    public List<PrescriptionDto> listByDoctor(Long doctorId) {
        // Fetch all appointments for this doctor
        List<Appointment> doctorAppointments = appointmentRepository.findByDoctorId(doctorId);

        List<PrescriptionDto> result = new ArrayList<>();
        for (Appointment appt : doctorAppointments) {
            List<Prescription> presList = prescriptionRepository.findByAppointmentId(appt.getId());
            for (Prescription p : presList) {
                result.add(new PrescriptionDto(p.getId(), p.getAppointmentId(), p.getDateIssued(), p.getNotes()));
            }
        }

        // Sort by date descending
        result.sort((a, b) -> b.getDateIssued().compareTo(a.getDateIssued()));

        return result;
    }

}

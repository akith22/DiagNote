package com.example.backend.service;

import com.example.backend.dto.PrescriptionDto;
import com.example.backend.model.Appointment;
import com.example.backend.model.AppointmentStatus;
import com.example.backend.model.Prescription;
import com.example.backend.model.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.PrescriptionRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;
import com.example.backend.dto.PrescriptionResponse;
import com.example.backend.model.Prescription;
import com.example.backend.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;

    public PrescriptionService(PrescriptionRepository prescriptionRepository,
            AppointmentRepository appointmentRepository,
            UserRepository userRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
    }

    // ---------------- Helper Methods ----------------
    private PrescriptionDto toDto(Prescription p) {
        PrescriptionDto dto = new PrescriptionDto();
        dto.setId(p.getId());
        dto.setNotes(p.getNotes());
        dto.setDateIssued(p.getDateIssued());
        dto.setAppointmentId(p.getAppointment() != null ? p.getAppointment().getId() : null);

        if (p.getAppointment() != null &&
                p.getAppointment().getPatient() != null &&
                p.getAppointment().getPatient().getUser() != null) {
            dto.setPatientName(p.getAppointment().getPatient().getUser().getName());
        }
        return dto;
    }

    private String safeNotes(String notes) {
        if (notes == null)
            return null;
        return notes.length() > 1000 ? notes.substring(0, 1000) : notes;
    }

    private User getAuthenticatedDoctor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            throw new RuntimeException("Not authenticated");

        String email = auth.getName(); // JWT username = email
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    // ---------------- Create Prescription ----------------
    @Transactional
    public PrescriptionDto createPrescription(Integer appointmentId, PrescriptionDto dto) {
        User doctor = getAuthenticatedDoctor();

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        if (!appointment.getDoctor().getUser().getUserId().equals(doctor.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized for this appointment");
        }

        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Prescription can only be created for CONFIRMED appointments");
        }

        if (dto.getNotes() == null || dto.getNotes().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Notes are required");
        }

        Prescription prescription = new Prescription();
        prescription.setAppointment(appointment);
        prescription.setNotes(safeNotes(dto.getNotes()));
        prescription.setDateIssued(dto.getDateIssued() != null ? dto.getDateIssued() : LocalDateTime.now());

        Prescription saved = prescriptionRepository.save(prescription);

        // Mark appointment as COMPLETED
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);

        return toDto(saved);
    }

    // ---------------- Update Prescription ----------------
    @Transactional
    public PrescriptionDto updatePrescription(Integer prescriptionId, PrescriptionDto dto) {
        User doctor = getAuthenticatedDoctor();

        Prescription p = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prescription not found"));

        if (!p.getAppointment().getDoctor().getUser().getUserId().equals(doctor.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        if (dto.getNotes() != null && !dto.getNotes().isBlank()) {
            p.setNotes(safeNotes(dto.getNotes()));
        }

        if (dto.getDateIssued() != null) {
            p.setDateIssued(dto.getDateIssued());
        }

        Prescription saved = prescriptionRepository.save(p);
        return toDto(saved);
    }

    // ---------------- Delete Prescription ----------------
    @Transactional
    public void deletePrescription(Integer prescriptionId) {
        User doctor = getAuthenticatedDoctor();

        Prescription p = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prescription not found"));

        if (!p.getAppointment().getDoctor().getUser().getUserId().equals(doctor.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        prescriptionRepository.delete(p);
    }

    // ---------------- Get by ID ----------------
    public PrescriptionDto getById(Integer prescriptionId) {
        User doctor = getAuthenticatedDoctor();

        Prescription p = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prescription not found"));

        if (!p.getAppointment().getDoctor().getUser().getUserId().equals(doctor.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        return toDto(p);
    }

    // ---------------- Get by Appointment ----------------
    public List<PrescriptionDto> getByAppointmentId(Integer appointmentId) {
        User doctor = getAuthenticatedDoctor();

        List<Prescription> prescriptions = prescriptionRepository.findByAppointment_Id(appointmentId);

        if (prescriptions.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "No prescriptions found for this appointment");
        }

        // Authorization check
        prescriptions.forEach(p -> {
            if (!p.getAppointment().getDoctor().getUser().getUserId().equals(doctor.getUserId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
            }
        });

        return prescriptions.stream().map(this::toDto).collect(Collectors.toList());
    }

    // ---------------- Updated: Prescription + Patient Details ----------------
    public Map<String, Object> getPrescriptionWithPatientName(Integer prescriptionId) {
        User doctor = getAuthenticatedDoctor();

        Prescription p = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Prescription not found"));

        if (!p.getAppointment().getDoctor().getUser().getUserId().equals(doctor.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        Appointment appointment = p.getAppointment();
        var patient = appointment.getPatient();

        Map<String, Object> map = new HashMap<>();
        map.put("prescriptionId", p.getId());
        map.put("notes", p.getNotes());
        map.put("appointmentId", appointment.getId());
        map.put("dateIssued", p.getDateIssued());

        map.put("patientName", patient.getUser().getName());
        map.put("patientAddress", patient.getAddress());
        map.put("patientGender", patient.getGender());
        map.put("patientAge", patient.getAge());

        return map;
    }

    // ---------------- All Prescriptions by Doctor ----------------
    public List<PrescriptionDto> getAllPrescriptionsByDoctorId() {

        User doctor = getAuthenticatedDoctor();

        List<Prescription> prescriptions = prescriptionRepository
                .findPrescriptionsByAppointment_Doctor_User_Email(doctor.getEmail())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return prescriptions.stream().map(this::toDto).collect(Collectors.toList());
    }

    // ---------------- Get Patient Details by Appointment ----------------
    public Map<String, Object> getPatientDetailsByAppointmentId(Integer appointmentId) {
        User doctor = getAuthenticatedDoctor();

        // Fetch the appointment
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        // Ensure doctor is authorized
        if (!appointment.getDoctor().getUser().getUserId().equals(doctor.getUserId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }

        // Get patient info
        var patient = appointment.getPatient();

        Map<String, Object> patientDetails = new HashMap<>();
        patientDetails.put("patientId", patient.getId());
        patientDetails.put("name", patient.getUser().getName());
        patientDetails.put("email", patient.getUser().getEmail());
        patientDetails.put("gender", patient.getGender());
        patientDetails.put("age", patient.getAge());
        patientDetails.put("address", patient.getAddress());

        return patientDetails;
    }

    public List<PrescriptionResponse> getPrescriptionsForPatient(Integer patientId) {
        List<Prescription> prescriptions = prescriptionRepository.findAllByPatientId(patientId);

        return prescriptions.stream().map(prescription -> {
            PrescriptionResponse.AppointmentInfo appointmentInfo = new PrescriptionResponse.AppointmentInfo(
                    prescription.getAppointment().getId(),
                    prescription.getAppointment().getAppointmentDateTime()
                            .format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                    prescription.getAppointment().getAppointmentDateTime().format(DateTimeFormatter.ofPattern("HH:mm")),
                    new PrescriptionResponse.DoctorInfo(
                            prescription.getAppointment().getDoctor().getUser().getName(),
                            prescription.getAppointment().getDoctor().getSpecialization()));

            return new PrescriptionResponse(
                    prescription.getId(),
                    prescription.getNotes(),
                    prescription.getDateIssued(),
                    appointmentInfo);
        }).collect(Collectors.toList());
    }
}

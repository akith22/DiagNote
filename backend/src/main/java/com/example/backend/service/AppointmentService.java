package com.example.backend.service;

import com.example.backend.dto.AppointmentRequest;
import com.example.backend.dto.AppointmentResponse;
import com.example.backend.model.Appointment;
import com.example.backend.model.AppointmentStatus;
import com.example.backend.model.Doctor;
import com.example.backend.model.Patient;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.DoctorRepository;
import com.example.backend.repository.PatientRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              DoctorRepository doctorRepository,
                              PatientRepository patientRepository) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public AppointmentResponse bookAppointment(AppointmentRequest request) {
        if (request.getDoctorId() == null || request.getAppointmentDateTime() == null) {
            throw new IllegalArgumentException("Doctor and appointmentDateTime are required");
        }

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        // Check if doctor is already booked
        if (appointmentRepository.existsByDoctorAndAppointmentDateTime(doctor, request.getAppointmentDateTime())) {
            return null; // Instead of throwing exception
        }

        Appointment appt = new Appointment();
        appt.setDoctor(doctor);
        appt.setPatient(patient);
        appt.setAppointmentDateTime(request.getAppointmentDateTime());
        appt.setStatus(AppointmentStatus.CONFIRMED);

        Appointment saved = appointmentRepository.save(appt);
        return mapToResponse(saved);
    }


    public List<AppointmentResponse> getAppointmentsForDoctor(Integer doctorId) {
        List<Appointment> list = appointmentRepository.findByDoctorIdAndStatusIn(
                doctorId, Arrays.asList(AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING)
        );
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsForPatient(Integer patientId) {
        List<Appointment> list = appointmentRepository.findByPatientIdAndStatusIn(
                patientId, Arrays.asList(AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING)
        );
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public AppointmentResponse rescheduleAppointment(Integer appointmentId, LocalDateTime newDateTime) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (appt.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Cannot reschedule a cancelled appointment");
        }

        if (appointmentRepository.existsByDoctorAndAppointmentDateTime(appt.getDoctor(), newDateTime)) {
            throw new RuntimeException("Doctor not available at the requested new time");
        }

        appt.setAppointmentDateTime(newDateTime);
        appt.setStatus(AppointmentStatus.CONFIRMED); // Use valid enum after reschedule
        Appointment saved = appointmentRepository.save(appt);

        return mapToResponse(saved);
    }

    @Transactional
    public void cancelAppointment(Integer appointmentId) {
        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));
        appt.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appt);
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        AppointmentResponse dto = new AppointmentResponse();
        dto.setAppointmentId(appointment.getId());
        dto.setDoctorId(appointment.getDoctor().getId());
        dto.setDoctorName(appointment.getDoctor().getUser() != null ? appointment.getDoctor().getUser().getName() : null);
        dto.setPatientId(appointment.getPatient().getId());
        dto.setPatientName(appointment.getPatient().getUser() != null ? appointment.getPatient().getUser().getName() : null);
        dto.setAppointmentDateTime(appointment.getAppointmentDateTime());
        dto.setStatus(appointment.getStatus().name());
        return dto;
    }
}

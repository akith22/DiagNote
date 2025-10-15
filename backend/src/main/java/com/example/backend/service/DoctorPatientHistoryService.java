package com.example.backend.service;

import com.example.backend.dto.DoctorPatientHistoryDto;
import com.example.backend.model.Appointment;
import com.example.backend.model.Patient;
import com.example.backend.model.Prescription;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.PatientRepository;
import com.example.backend.repository.PrescriptionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class DoctorPatientHistoryService {

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;

    public DoctorPatientHistoryService(PatientRepository patientRepository,
                                       AppointmentRepository appointmentRepository,
                                       PrescriptionRepository prescriptionRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
        this.prescriptionRepository = prescriptionRepository;
    }

    public DoctorPatientHistoryDto getPatientHistoryByEmail(String email) {

        // ✅ Find patient directly by email
        Patient patient = patientRepository.findByUser_Email(email)
                .orElseThrow(() -> new NoSuchElementException("Patient not found with email: " + email));

        DoctorPatientHistoryDto dto = new DoctorPatientHistoryDto();
        dto.setName(patient.getUser().getName()); // changed to getFullName()
        dto.setEmail(patient.getUser().getEmail());
        dto.setGender(patient.getGender());
        dto.setAge(patient.getAge());
        dto.setAddress(patient.getAddress());

        // ✅ Fetch appointments directly from repository
        List<Appointment> appointments = appointmentRepository.findByPatient_Id(patient.getId())
                .orElse(List.of());

        List<DoctorPatientHistoryDto.AppointmentInfo> appointmentInfos = appointments.stream().map(a -> {
            DoctorPatientHistoryDto.AppointmentInfo ai = new DoctorPatientHistoryDto.AppointmentInfo();
            ai.setId(a.getId());
            ai.setDoctorName(a.getDoctor().getUser().getName());
            ai.setDate(a.getAppointmentDateTime());
            ai.setStatus(a.getStatus().name());
            return ai;
        }).collect(Collectors.toList());

        // ✅ Fetch prescriptions directly from repository
        List<Prescription> prescriptions = prescriptionRepository.findByAppointment_Patient_Id(patient.getId())
                .orElse(List.of());

        List<DoctorPatientHistoryDto.PrescriptionInfo> prescriptionInfos = prescriptions.stream().map(p -> {
            DoctorPatientHistoryDto.PrescriptionInfo pi = new DoctorPatientHistoryDto.PrescriptionInfo();
            pi.setId(p.getId());
            pi.setDoctorName(p.getAppointment().getDoctor().getUser().getName());
            pi.setNotes(p.getNotes());
            pi.setDateIssued(p.getDateIssued());
            return pi;
        }).collect(Collectors.toList());

        dto.setAppointments(appointmentInfos);
        dto.setPrescriptions(prescriptionInfos);

        return dto;
    }
}

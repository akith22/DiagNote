package com.example.backend.service;

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

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public List<PrescriptionResponse> getPrescriptionsForPatient(Integer patientId) {
        List<Prescription> prescriptions = prescriptionRepository.findAllByPatientId(patientId);
        
        return prescriptions.stream().map(prescription -> {
            PrescriptionResponse.AppointmentInfo appointmentInfo = new PrescriptionResponse.AppointmentInfo(
                prescription.getAppointment().getId(),
                prescription.getAppointment().getAppointmentDateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")),
                prescription.getAppointment().getAppointmentDateTime().format(DateTimeFormatter.ofPattern("HH:mm")),
                new PrescriptionResponse.DoctorInfo(
                    prescription.getAppointment().getDoctor().getUser().getName(),
                    prescription.getAppointment().getDoctor().getSpecialization()
                )
            );
            
            return new PrescriptionResponse(
                prescription.getId(),
                prescription.getNotes(),
                prescription.getDateIssued(),
                appointmentInfo
            );
        }).collect(Collectors.toList());
    }
}

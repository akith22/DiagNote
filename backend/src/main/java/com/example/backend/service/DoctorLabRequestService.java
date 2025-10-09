package com.example.backend.service;

import com.example.backend.dto.DoctorLabRequestDto;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorLabRequestService {

    private final LabRequestRepository labRequestRepository;
    private final AppointmentRepository appointmentRepository;

    public DoctorLabRequestService(LabRequestRepository labRequestRepository, AppointmentRepository appointmentRepository) {
        this.labRequestRepository = labRequestRepository;
        this.appointmentRepository = appointmentRepository;
    }

    // ✅ Create new lab request using appointmentId
    public DoctorLabRequestDto createLabRequest(Integer appointmentId, DoctorLabRequestDto dto) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        LabRequest request = new LabRequest();
        request.setAppointment(appointment);
        request.setTestType(dto.getTestType());
        request.setStatus(LabRequest.Status.REQUESTED);

        LabRequest saved = labRequestRepository.save(request);

        return mapToDto(saved);
    }

    // ✅ Get all lab requests by appointment
    public List<DoctorLabRequestDto> getLabRequestsByAppointment(Integer appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Appointment not found"));

        return labRequestRepository.findByAppointment(appointment).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ✅ Get single lab request
    public DoctorLabRequestDto getLabRequestById(Integer id) {
        LabRequest request = labRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Lab request not found"));

        return mapToDto(request);
    }

    // ✅ Mapping helper
    private DoctorLabRequestDto mapToDto(LabRequest request) {
        String patientName = request.getAppointment().getPatient() != null
                ? request.getAppointment().getPatient().getUser().getName()
                : "Unknown";

        return new DoctorLabRequestDto(
                request.getId(),
                request.getStatus().name(),
                request.getTestType(),
                request.getAppointment().getId(),
                patientName
        );
    }
}

package com.example.backend.service;

import com.example.backend.dto.LabRequestDto;
import com.example.backend.model.Appointment;
import com.example.backend.model.LabRequest;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.LabRequestRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LabRequestService {

    @Autowired
    private LabRequestRepository labRequestRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // 🔹 Create a new lab request linked to an appointment
    @Transactional
    public LabRequestDto createLabRequest(LabRequestDto dto) {
        Appointment appointment = appointmentRepository.findById(dto.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        LabRequest labRequest = new LabRequest();
        labRequest.setTestType(dto.getTestType());
        labRequest.setStatus(LabRequest.Status.REQUESTED);
        labRequest.setAppointment(appointment);

        LabRequest saved = labRequestRepository.save(labRequest);
        return mapToDto(saved);
    }

    // 🔹 Get all lab requests
    public List<LabRequestDto> getAllLabRequests() {
        return labRequestRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 🔹 Get all lab requests by appointment
    public List<LabRequestDto> getLabRequestsByAppointment(Integer appointmentId) {
        return labRequestRepository.findByAppointmentId(appointmentId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // 🔹 Update lab request status (e.g., mark as COMPLETED)
    @Transactional
    public LabRequestDto updateLabRequestStatus(Integer id, LabRequest.Status status) {
        LabRequest request = labRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LabRequest not found"));

        request.setStatus(status);
        LabRequest updated = labRequestRepository.save(request);
        return mapToDto(updated);
    }

    // 🔹 Helper: Map entity → DTO
    private LabRequestDto mapToDto(LabRequest request) {
        LabRequestDto dto = new LabRequestDto();
        dto.setId(request.getId());
        dto.setStatus(request.getStatus().name());
        dto.setTestType(request.getTestType());
        dto.setAppointmentId(request.getAppointment().getId());
        return dto;
    }
}

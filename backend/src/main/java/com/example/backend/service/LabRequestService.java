package com.example.backend.service;

import com.example.backend.dto.LabRequestDto;
import com.example.backend.dto.LabRequestResponse;
import com.example.backend.model.*;
import com.example.backend.repository.LabRequestRepository;
import com.example.backend.repository.LabTechRepository;
import com.example.backend.repository.PatientRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LabRequestService {

    @Autowired
    private LabRequestRepository labRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private LabTechRepository labTechRepository;

    // 🔹 Create a new lab request (Doctor)
    @Transactional
    public LabRequestResponse createLabRequest(LabRequestDto dto) {
        // Get authenticated doctor
        User doctorUser = getAuthenticatedUser();
        if (doctorUser == null) throw new RuntimeException("User not authenticated");

        Doctor doctor = doctorUser.getRole() == Role.DOCTOR
                ? doctorRepository.findByUser(doctorUser)
                .orElseThrow(() -> new RuntimeException("Doctor not found"))
                : null;

        if (doctor == null) throw new RuntimeException("Only doctors can create lab requests");

        // Get patient
        User patientUser = userRepository.findByEmail(dto.getPatientEmail())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Patient patient = patientRepository.findById(patientUser.getUserId())
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        LabRequest labRequest = new LabRequest();
        labRequest.setDoctor(doctor);
        labRequest.setPatient(patient);
        labRequest.setTestName(dto.getTestName());
        labRequest.setStatus(LabRequestStatus.PENDING);
        labRequest.setRequestedAt(LocalDateTime.now());

        LabRequest saved = labRequestRepository.save(labRequest);

        return mapToResponse(saved);
    }

    // 🔹 Get all lab requests for authenticated lab tech
    public List<LabRequestResponse> getLabRequestsForLabTech() {
        User labTechUser = getAuthenticatedUser();
        if (labTechUser == null || labTechUser.getRole() != Role.LABTECH) {
            throw new RuntimeException("User not authorized");
        }

        LabTech labTech = labTechRepository.findByUser(labTechUser)
                .orElseThrow(() -> new RuntimeException("LabTech not found"));

        List<LabRequest> requests = labRequestRepository.findByLabTech(labTech);

        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // 🔹 Get lab requests for patient
    public List<LabRequestResponse> getLabRequestsForPatient() {
        User patientUser = getAuthenticatedUser();
        if (patientUser == null || patientUser.getRole() != Role.PATIENT) {
            throw new RuntimeException("User not authorized");
        }

        List<LabRequest> requests = labRequestRepository.findByPatientId(patientUser.getUserId());

        return requests.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    // 🔹 Update lab request status (LabTech)
    @Transactional
    public LabRequestResponse updateLabRequestStatus(Long requestId, LabRequestStatus status) {
        LabRequest request = labRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("LabRequest not found"));

        request.setStatus(status);
        labRequestRepository.save(request);

        return mapToResponse(request);
    }

    // 🔹 Assign lab tech to request (Doctor/Admin)
    @Transactional
    public LabRequestResponse assignLabTech(Long requestId, Integer labTechId) {
        LabRequest request = labRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("LabRequest not found"));

        LabTech labTech = labTechRepository.findById(labTechId)
                .orElseThrow(() -> new RuntimeException("LabTech not found"));

        request.setLabTech(labTech);
        labRequestRepository.save(request);

        return mapToResponse(request);
    }

    // 🔹 Helper: Map LabRequest to Response DTO
    private LabRequestResponse mapToResponse(LabRequest request) {
        LabRequestResponse dto = new LabRequestResponse();
        dto.setRequestId(request.getId());
        dto.setDoctorId(request.getDoctor().getId());
        dto.setDoctorName(request.getDoctor().getUser().getName());
        dto.setPatientId(request.getPatient().getId());
        dto.setPatientName(request.getPatient().getUser().getName());
        dto.setLabTechId(request.getLabTech() != null ? request.getLabTech().getId() : null);
        dto.setLabTechName(request.getLabTech() != null ? request.getLabTech().getUser().getName() : null);
        dto.setTestName(request.getTestName());
        dto.setStatus(request.getStatus().name());
        dto.setRequestedAt(request.getRequestedAt());
        return dto;
    }

    // 🔹 Helper: Get authenticated user
    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;

        String email = auth.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    @Autowired
    private com.example.backend.repository.DoctorRepository doctorRepository;
}

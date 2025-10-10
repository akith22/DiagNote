package com.example.backend.service;

import com.example.backend.dto.DoctorLabRequestDto;
import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DoctorLabRequestService {

    private final LabRequestRepository labRequestRepository;
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;



    public DoctorLabRequestService(LabRequestRepository labRequestRepository,
                                   AppointmentRepository appointmentRepository,
                                   UserRepository userRepository) { // add this
        this.labRequestRepository = labRequestRepository;
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository; // assign it!
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


    public List<DoctorLabRequestDto> getAllLabRequestsByDoctor() {
        User doctor = getAuthenticatedDoctor();

        List<LabRequest> labRequests = labRequestRepository
                .findByAppointment_Doctor_User_Email(doctor.getEmail())
                .orElseThrow(() -> new RuntimeException("No lab requests found for this doctor"));

        return labRequests.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Helper method to get the logged-in doctor
    private User getAuthenticatedDoctor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // assuming username is email
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated doctor not found"));
    }


}

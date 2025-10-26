package com.example.backend.service;

import com.example.backend.dto.AppointmentPrescriptionDto;
import com.example.backend.dto.DoctorPatientHistoryDto;
import com.example.backend.dto.PatientHistoryDto;
import com.example.backend.model.Appointment;
import com.example.backend.model.Patient;
import com.example.backend.model.Prescription;
import com.example.backend.model.User;
import com.example.backend.repository.AppointmentRepository;
import com.example.backend.repository.PatientRepository;
import com.example.backend.repository.PrescriptionRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.backend.repository.LabReportRepository;
import com.example.backend.model.LabReport;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.NoSuchElementException;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class DoctorPatientHistoryService {

    @Autowired
    private  PatientRepository patientRepository;

    @Autowired
    private  AppointmentRepository appointmentRepository;

    @Autowired
    private  PrescriptionRepository prescriptionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LabReportRepository labReportRepository;


    // ✅ Fetch patient history using appointment ID (Integer)
    public PatientHistoryDto getPatientHistoryByPatientEmail(String email) {

        Integer user  = userRepository.findByEmail(email).orElseThrow().getUserId();

        PatientHistoryDto patientHistory = appointmentRepository.findPatientBasicInfo(user);

        if (patientHistory != null) {
            // Get appointment and prescription history
            List<AppointmentPrescriptionDto> history = appointmentRepository.findCompletePatientHistory(user);
            patientHistory.setHistory(history);
        }

        return patientHistory;
    }


    /**
     * ✅ Fetch and stream lab report file (PDF, image, etc.)
     */
    public Resource getLabReportFile(String fileName) {
        try {
            // ✅ FIXED: Use the correct path - files are in uploads/ not uploads/lab-reports/
            Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();

            System.out.println("🔍 DEBUG - Current working directory: " + Paths.get("").toAbsolutePath());
            System.out.println("🔍 DEBUG - Upload directory path: " + uploadDir.toString());

            // ✅ Create directory if it doesn't exist
            if (!Files.exists(uploadDir)) {
                System.out.println("📁 Directory doesn't exist, creating: " + uploadDir);
                Files.createDirectories(uploadDir);
                System.out.println("✅ Directory created successfully");
            } else {
                System.out.println("✅ Directory exists: " + uploadDir);
            }

            // ✅ Resolve the requested file safely
            Path filePath = uploadDir.resolve(fileName).normalize();
            System.out.println("🔍 DEBUG - Full file path: " + filePath.toString());

            // ✅ Security check: ensure the file path doesn't escape the upload directory
            if (!filePath.startsWith(uploadDir)) {
                throw new SecurityException("Invalid file path attempt: " + fileName);
            }

            // ✅ Check if file exists
            if (!Files.exists(filePath)) {
                // List available files for debugging
                System.out.println("❌ File not found. Available files in directory:");
                try (Stream<Path> files = Files.list(uploadDir)) {
                    List<String> fileList = files.map(path -> path.getFileName().toString())
                            .collect(Collectors.toList());
                    if (fileList.isEmpty()) {
                        System.out.println("   📁 Directory is EMPTY");
                    } else {
                        fileList.forEach(f -> System.out.println("   - " + f));
                    }
                } catch (IOException e) {
                    System.out.println("   ❌ Could not list directory: " + e.getMessage());
                }
                throw new RuntimeException("File not found: " + fileName + " at path: " + filePath);
            }

            // ✅ Check if file is readable
            if (!Files.isReadable(filePath)) {
                throw new RuntimeException("File exists but is not readable: " + fileName);
            }

            // ✅ Get file info for debugging
            long fileSize = Files.size(filePath);
            System.out.println("✅ File found - Size: " + fileSize + " bytes, Readable: " + Files.isReadable(filePath));

            Resource resource = new UrlResource(filePath.toUri());

            // ✅ Double-check resource
            if (!resource.exists()) {
                throw new RuntimeException("UrlResource reports file doesn't exist: " + fileName);
            }

            if (!resource.isReadable()) {
                throw new RuntimeException("UrlResource reports file not readable: " + fileName);
            }

            System.out.println("🎯 Successfully loaded file: " + fileName);
            return resource;

        } catch (SecurityException e) {
            System.err.println("🔒 Security violation for file: " + fileName);
            throw new RuntimeException("Security violation: " + e.getMessage(), e);
        } catch (IOException e) {
            System.err.println("💾 I/O Error for file: " + fileName);
            throw new RuntimeException("I/O error accessing file: " + fileName + " - " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error for file: " + fileName);
            throw new RuntimeException("Error accessing file: " + fileName + " - " + e.getMessage(), e);
        }
    }
}

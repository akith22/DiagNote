package com.example.backend.repository;

import com.example.backend.model.LabReport;
import com.example.backend.model.LabRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LabReportRepository extends JpaRepository<LabReport, Integer> {
    Optional<LabReport> findByLabRequest(LabRequest labRequest);
    @Query("SELECT lr FROM LabReport lr WHERE lr.labRequest.id = :labRequestId")
    Optional<LabReport> findByLabRequestId(@Param("labRequestId") Integer labRequestId);

    List<LabReport> findByLabRequest_Appointment_Doctor_User_Email(String doctorEmail);

    // Find report by lab request id
    Optional<LabReport> findByLabRequest_Id(Integer labRequestId);




}





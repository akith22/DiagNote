package com.example.backend.repository;

import com.example.backend.model.LabReport;
import com.example.backend.model.LabRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LabReportRepository extends JpaRepository<LabReport, Integer> {
    Optional<LabReport> findByLabRequest(LabRequest labRequest);
}

package com.example.backend.repository;

import com.example.backend.model.ViewLabReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ViewLabReportRepository extends JpaRepository<ViewLabReport, Integer> {

    @Query("SELECT r FROM ViewLabReport r " +
            "WHERE r.labRequest.appointment.patient.user.userId = :userId " +
            "ORDER BY r.dateIssued DESC")
    List<ViewLabReport> findByPatientUserId(@Param("userId") Integer userId);
}

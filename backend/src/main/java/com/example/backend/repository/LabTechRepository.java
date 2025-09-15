package com.example.backend.repository;

import com.example.backend.model.Doctor;
import com.example.backend.model.LabTech;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LabTechRepository extends JpaRepository<LabTech, Integer> {

    Optional<LabTech> findByUserUserId(Integer userId);

    Optional<LabTech> findByUser(User user);

    Boolean existsByUser(User user);

    void deleteByUser(User user);
}

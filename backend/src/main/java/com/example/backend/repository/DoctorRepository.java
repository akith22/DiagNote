package com.example.backend.repository;

import com.example.backend.model.Doctor;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByUserUserId(Integer userId);

    Optional<Doctor> findByUser(User user);

    Boolean existsByUser(User user);

    void deleteByUser(User user);
}

package com.example.backend.repository;

import com.example.backend.model.Doctor;
import com.example.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByUserUserId(Integer userId);

    Optional<Doctor> findByUser(User user);

    Boolean existsByUser(User user);

    void deleteByUser(User user);


    @Query("SELECT d FROM Doctor d " +
            "WHERE (:name IS NULL OR LOWER(d.user.name) LIKE LOWER(CONCAT('%', :name, '%'))) " +
            "AND (:special IS NULL OR LOWER(d.specilization) LIKE LOWER(CONCAT('%', :special, '%')))")
    List<Doctor> searchDoctors(@Param("name") String name, @Param("special") String special);
}

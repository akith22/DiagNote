package com.example.backend.service;

import com.example.backend.dto.LabTechDetailsDto;
import com.example.backend.dto.LabTechProfileResponse;
import com.example.backend.model.LabTech;
import com.example.backend.model.User;
import com.example.backend.repository.LabTechRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class LabTechService {
    @Autowired
    private LabTechRepository labTechRepository;

    @Autowired
    private UserRepository userRepository;

    public LabTechProfileResponse getLabTechProfile() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<LabTech> labTechOpt = labTechRepository.findByUser(user);

        if (labTechOpt.isPresent()) {
            LabTech labTech = labTechOpt.get();
            return new LabTechProfileResponse(
                    user.getName(),
                    user.getEmail(),
                    labTech.getDepartment(),
                    true
            );
        } else {
            return new LabTechProfileResponse(
                    user.getName(),
                    user.getEmail(),
                    null,
                    false
            );
        }
    }

    @Transactional
    public void saveOrUpdateLabTechDetails(LabTechDetailsDto labTechDetailsDto) {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Optional<LabTech> existingLabTech = labTechRepository.findByUser(user);

        LabTech labTech;
        if (existingLabTech.isPresent()) {
            labTech = existingLabTech.get();
        } else {
            labTech = new LabTech();
            labTech.setUser(user);
        }

        labTech.setDepartment(labTechDetailsDto.getDepartment());

        labTechRepository.save(labTech);
    }

    @Transactional
    public void deleteLabTechProfile() {
        String email = ((UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        labTechRepository.deleteByUser(user);
    }
}

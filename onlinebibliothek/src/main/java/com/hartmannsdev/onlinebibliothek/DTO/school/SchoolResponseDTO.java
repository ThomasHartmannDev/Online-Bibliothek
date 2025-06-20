package com.hartmannsdev.onlinebibliothek.DTO.school;

import com.hartmannsdev.onlinebibliothek.model.Schools;

import java.time.LocalDateTime;

public record SchoolResponseDTO (
        Long id,
        String name,
        String address,
        String contactEmail,
        LocalDateTime createdAt
){
    public SchoolResponseDTO(Schools schools){
        this(
                schools.getId(),
                schools.getName(),
                schools.getAddress(),
                schools.getContactEmail(),
                schools.getCreatedAt());
    }
}

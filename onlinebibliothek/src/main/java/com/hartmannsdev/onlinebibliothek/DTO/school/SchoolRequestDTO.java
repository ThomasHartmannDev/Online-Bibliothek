package com.hartmannsdev.onlinebibliothek.DTO.school;

import java.time.LocalDateTime;

public record SchoolRequestDTO (
        String name,
        String address,
        String contactEmail,
        LocalDateTime createdAt){
}

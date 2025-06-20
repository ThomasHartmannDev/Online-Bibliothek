package com.hartmannsdev.onlinebibliothek.DTO.modules;

import com.hartmannsdev.onlinebibliothek.model.Schools;

public record ModulesRequestDTO(
        String name,
        String description,
        Schools school
) {
}

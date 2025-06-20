package com.hartmannsdev.onlinebibliothek.DTO.modules;

import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.model.Schools;

public record ModulesResponseDTO(
        Long id,
        String name,
        String description,
        Schools school
) {
    public ModulesResponseDTO(Modules modules) {
        this(
                modules.getId(),
                modules.getName(),
                modules.getDescription(),
                modules.getSchools()
        );
    }
}

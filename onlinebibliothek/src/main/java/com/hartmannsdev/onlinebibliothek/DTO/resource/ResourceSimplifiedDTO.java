package com.hartmannsdev.onlinebibliothek.DTO.resource;

import com.hartmannsdev.onlinebibliothek.DTO.modules.ModuleSimplifiedDTO;
import com.hartmannsdev.onlinebibliothek.DTO.user.UserSimplifiedDTO;

import java.time.LocalDateTime;

// DTO para o resource simplificado

public record ResourceSimplifiedDTO(
        Long id,
        String title,
        String url,
        ModuleSimplifiedDTO modulo,
        UserSimplifiedDTO uploadedBy,
        UserSimplifiedDTO userOwner,
        LocalDateTime createdAt
) { }

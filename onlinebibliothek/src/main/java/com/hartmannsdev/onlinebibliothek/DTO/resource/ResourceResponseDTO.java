package com.hartmannsdev.onlinebibliothek.DTO.resource;

import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.model.Resource;
import com.hartmannsdev.onlinebibliothek.model.User;

import java.time.LocalDateTime;

public record ResourceResponseDTO(
        Long id,
        String Title,
        String URL,
        Modules modules,
        User uploadedBy,
        User userOwner,
        LocalDateTime createdAt
) {
    public ResourceResponseDTO(Resource resource){
        this(
                resource.getId(),
                resource.getTitle(),
                resource.getURL(),
                resource.getModule(),
                resource.getUploadedBy(),
                resource.getUserOwner(),
                resource.getCreatedAt()
        );
    }
}

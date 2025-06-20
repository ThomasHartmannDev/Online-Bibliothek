package com.hartmannsdev.onlinebibliothek.DTO.resource;

import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.model.User;

public record ResourceRequestDTO(
        String Title,
        String URL,
        Modules module,
        User uploadedBy,
        User UserOwner
) { }

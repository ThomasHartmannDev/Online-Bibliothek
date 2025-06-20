package com.hartmannsdev.onlinebibliothek.DTO.user;

import com.hartmannsdev.onlinebibliothek.model.Schools;
import com.hartmannsdev.onlinebibliothek.utils.UserRole;

public record UserRequestDTO(String name,
                             String email,
                             String password,
                             UserRole role,
                             Long schoolId) { }

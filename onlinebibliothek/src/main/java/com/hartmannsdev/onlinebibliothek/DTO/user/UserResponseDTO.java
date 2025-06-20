package com.hartmannsdev.onlinebibliothek.DTO.user;

import com.hartmannsdev.onlinebibliothek.utils.UserRole;
import com.hartmannsdev.onlinebibliothek.model.User;

import java.time.LocalDateTime;

public record UserResponseDTO(
        Long id,
        String name,
        String email,
        String password,
        UserRole role,
        LocalDateTime createdAt
) {
    public UserResponseDTO(User user){
        this(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                user.getRole(),
                user.getCreatedAt()
        );
    }

}

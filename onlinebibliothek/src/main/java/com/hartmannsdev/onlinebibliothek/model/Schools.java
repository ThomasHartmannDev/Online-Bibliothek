package com.hartmannsdev.onlinebibliothek.model;


import com.hartmannsdev.onlinebibliothek.DTO.school.SchoolRequestDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class Schools {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String address;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Schools(SchoolRequestDTO data) {
        this.name = data.name();
        this.address = data.address();
        this.contactEmail = data.contactEmail();
        this.createdAt = LocalDateTime.now();
    }

    public Schools() {}
}

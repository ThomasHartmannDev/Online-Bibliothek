package com.hartmannsdev.onlinebibliothek.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
public class Feedbacks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "resource_id")
    private Resource resource;

    private int rating;
    private String comment;
    private LocalDateTime createdAt;

}

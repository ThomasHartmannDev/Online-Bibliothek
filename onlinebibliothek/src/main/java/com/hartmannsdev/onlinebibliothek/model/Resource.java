package com.hartmannsdev.onlinebibliothek.model;

import com.hartmannsdev.onlinebibliothek.DTO.resource.ResourceRequestDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Table(name = "resources")
@Entity(name = "resource")
@Data
public class Resource {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;

    private String URL;

    @ManyToOne()
    @JoinColumn(name = "module_id")
    private Modules module;

    @ManyToOne()
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @ManyToOne()
    @JoinColumn(name = "user_owner")
    private User userOwner;

    public Resource(ResourceRequestDTO data) {
        this.title = data.Title();
        this.URL = data.URL();
        this.module = data.module();
        this.uploadedBy = data.uploadedBy();
        this.userOwner = data.UserOwner();
        this.createdAt = LocalDateTime.now();
    }

    public Resource() {}
}

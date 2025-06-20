package com.hartmannsdev.onlinebibliothek.model;

import com.hartmannsdev.onlinebibliothek.DTO.modules.ModulesRequestDTO;
import jakarta.persistence.*;
import lombok.Data;


@Entity
@Data
public class Modules {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;
    @ManyToOne
    @JoinColumn(name = "school_id")
    private Schools schools;

    public Modules(ModulesRequestDTO data) {
        this.name = data.name();
        this.description = data.description();
        this.schools = data.school();
    }

    public Modules() {}
}

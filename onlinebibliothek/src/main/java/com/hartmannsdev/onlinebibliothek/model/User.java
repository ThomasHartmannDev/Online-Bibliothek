package com.hartmannsdev.onlinebibliothek.model;

import com.hartmannsdev.onlinebibliothek.DTO.user.UserRequestDTO;
import com.hartmannsdev.onlinebibliothek.utils.UserRole;
import com.hartmannsdev.onlinebibliothek.utils.UserRoleConverter;
import jakarta.persistence.*;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


@Entity
@Data
@Table(name = "users")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;

    @Column(name="password_hash")
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @ManyToOne()
    @JoinColumn(name = "school_id")
    private Schools schools;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public User(UserRequestDTO data, Schools school, String password) {
        this.name = data.name();
        this.email = data.email();
        this.role = data.role();
        this.schools = school;
        this.createdAt = LocalDateTime.now();
        this.password = password;
    }

    public User() {}


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.role.getGrantedAuthorities();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}



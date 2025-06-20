package com.hartmannsdev.onlinebibliothek.repository;

import com.hartmannsdev.onlinebibliothek.model.Schools;
import com.hartmannsdev.onlinebibliothek.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    UserDetails findByEmail(String email);
    List<User> findBySchools(Schools school);
}

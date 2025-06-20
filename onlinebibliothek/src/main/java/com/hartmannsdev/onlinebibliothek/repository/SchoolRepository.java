package com.hartmannsdev.onlinebibliothek.repository;

import com.hartmannsdev.onlinebibliothek.model.Schools;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchoolRepository extends JpaRepository<Schools, Long> {
}

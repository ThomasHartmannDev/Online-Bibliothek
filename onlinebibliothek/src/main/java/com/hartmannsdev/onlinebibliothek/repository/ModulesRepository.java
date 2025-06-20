package com.hartmannsdev.onlinebibliothek.repository;

import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.model.Schools;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ModulesRepository extends JpaRepository<Modules, Long> {
    List<Modules> findBySchools(Schools school);
}

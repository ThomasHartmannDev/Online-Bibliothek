package com.hartmannsdev.onlinebibliothek.controller;

import com.hartmannsdev.onlinebibliothek.DTO.school.SchoolRequestDTO;
import com.hartmannsdev.onlinebibliothek.DTO.school.SchoolResponseDTO;
import com.hartmannsdev.onlinebibliothek.model.Modules;
import com.hartmannsdev.onlinebibliothek.model.User;
import com.hartmannsdev.onlinebibliothek.service.school.SchoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schools")
public class SchoolController {

    @Autowired
    private SchoolService schoolService;

    // Criar uma nova
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<SchoolResponseDTO> createSchool(@RequestBody SchoolRequestDTO data) {
        return ResponseEntity.ok(schoolService.createSchool(data));
    }

    // Listar todas as escolas
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/getall")
    public ResponseEntity<List<SchoolResponseDTO>> getAllSchools() {
        return ResponseEntity.ok(schoolService.getAllSchools());
    }

    // Buscar uma escola por ID
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<SchoolResponseDTO> getSchoolById(@PathVariable Long id) {
        return ResponseEntity.ok(schoolService.getSchoolById(id));
    }

    // Obter todos os usuários associados à escola
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERM_VIEW_STUDENT')")
    @GetMapping("/{id}/users")
    public ResponseEntity<List<User>> getUsersBySchool(@PathVariable Long id) {
        return ResponseEntity.ok(schoolService.getUsersBySchool(id));
    }

    // Atualizar uma escola existente
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<SchoolResponseDTO> updateSchool(@PathVariable Long id, @RequestBody SchoolRequestDTO data) {
        return ResponseEntity.ok(schoolService.updateSchool(id, data));
    }

    // Excluir uma escola por ID
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchool(@PathVariable Long id) {
        schoolService.deleteSchool(id);
        return ResponseEntity.noContent().build();
    }

    // Obter todos os módulos associados à escola
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERM_VIEW_STUDENT')")
    @GetMapping("/{id}/modules")
    public ResponseEntity<List<Modules>> getModulesBySchool(@PathVariable Long id) {
        return ResponseEntity.ok(schoolService.getModulesBySchool(id));
    }

}

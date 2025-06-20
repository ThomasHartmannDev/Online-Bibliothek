package com.hartmannsdev.onlinebibliothek.controller;

import com.hartmannsdev.onlinebibliothek.DTO.modules.ModulesRequestDTO;
import com.hartmannsdev.onlinebibliothek.DTO.modules.ModulesResponseDTO;
import com.hartmannsdev.onlinebibliothek.service.modules.ModulesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/modules")
public class ModulesController {

    @Autowired
    private ModulesService modulesService;

    // Criar um novo módulo
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_ADD_MODULES')")
    @PostMapping("/create")
    public ResponseEntity<ModulesResponseDTO> createModule(@RequestBody ModulesRequestDTO data) {
        return ResponseEntity.ok(modulesService.createModule(data));
    }

    // Listar todos os módulos
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/getall")
    public ResponseEntity<List<ModulesResponseDTO>> getAllModules() {
        return ResponseEntity.ok(modulesService.getAllModules());
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_VIEW_MODULES')")
    @GetMapping("/{id}")
    public ResponseEntity<ModulesResponseDTO> getModuleById(@PathVariable Long id) {
        return ResponseEntity.ok(modulesService.getModuleById(id));
    }

    // Atualizar um módulo existente
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_EDIT_MODULES')")
    @PutMapping("/{id}")
    public ResponseEntity<ModulesResponseDTO> updateModule(@PathVariable Long id, @RequestBody ModulesRequestDTO data) {
        return ResponseEntity.ok(modulesService.updateModule(id, data));
    }

    // Excluir um módulo por ID
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_DELETE_MODULES')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteModule(@PathVariable Long id) {
        modulesService.deleteModule(id);
        return ResponseEntity.noContent().build();
    }
}

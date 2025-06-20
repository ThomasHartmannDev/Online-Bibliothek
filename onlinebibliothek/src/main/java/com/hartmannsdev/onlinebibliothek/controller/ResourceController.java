package com.hartmannsdev.onlinebibliothek.controller;

import com.hartmannsdev.onlinebibliothek.DTO.resource.ResourceRequestDTO;
import com.hartmannsdev.onlinebibliothek.DTO.resource.ResourceResponseDTO;
import com.hartmannsdev.onlinebibliothek.DTO.resource.ResourceSimplifiedDTO;
import com.hartmannsdev.onlinebibliothek.service.resource.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    // Criar um novo recurso
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_ADD_BOOKS')")
    @PostMapping("/create")
    public ResponseEntity<ResourceSimplifiedDTO> createResource(@RequestBody ResourceRequestDTO data) {
        return ResponseEntity.ok(resourceService.createResource(data));
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_VIEW_BOOKS')")
    @GetMapping("/school/{schoolId}")
    public ResponseEntity<List<ResourceSimplifiedDTO>> getResourcesBySchool(@PathVariable Long schoolId) {
        return ResponseEntity.ok(resourceService.getResourcesBySchool(schoolId));
    }


    // Listar todos os recursos
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/getall")
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    // Buscar um recurso por ID
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_VIEW_BOOKS')")
    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getResourceById(id));
    }

    // Atualizar um recurso existente
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_EDIT_BOOKS')")
    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(@PathVariable Long id, @RequestBody ResourceRequestDTO data) {
        return ResponseEntity.ok(resourceService.updateResource(id, data));
    }

    // Excluir um recurso por ID
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('PERM_DELETE_BOOKS')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    // Get all the books from a student
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or (hasAuthority('PERM_VIEW_BOOKS') and (#id == principal.id))")
    @GetMapping("/user/{id}/books")
    public ResponseEntity<List<ResourceSimplifiedDTO>> getBooksByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(resourceService.getBooksByUserId(id));
    }

}

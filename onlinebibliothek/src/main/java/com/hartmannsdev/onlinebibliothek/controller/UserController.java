package com.hartmannsdev.onlinebibliothek.controller;

import com.hartmannsdev.onlinebibliothek.DTO.user.UserRequestDTO;
import com.hartmannsdev.onlinebibliothek.DTO.user.UserResponseDTO;
import com.hartmannsdev.onlinebibliothek.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Only ADMIN and ITSUPPORT can create users
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERM_ADD_STUDENT')")
    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody UserRequestDTO data) {
        return userService.createNewUser(data);
    }

    // Only ADMIN can list all users
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/getall")
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERM_VIEW_STUDENT')")
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERM_EDIT_STUDENT')")
    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id, @RequestBody UserRequestDTO data) {
        return ResponseEntity.ok(userService.updateUser(id, data));
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'PERM_DELETE_STUDENT')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}

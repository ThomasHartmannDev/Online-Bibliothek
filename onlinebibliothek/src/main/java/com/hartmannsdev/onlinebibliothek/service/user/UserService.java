package com.hartmannsdev.onlinebibliothek.service.user;

import com.hartmannsdev.onlinebibliothek.DTO.user.UserRequestDTO;
import com.hartmannsdev.onlinebibliothek.DTO.user.UserResponseDTO;
import com.hartmannsdev.onlinebibliothek.model.Schools;
import com.hartmannsdev.onlinebibliothek.model.User;
import com.hartmannsdev.onlinebibliothek.repository.SchoolRepository;
import com.hartmannsdev.onlinebibliothek.repository.UserRepository;
import com.hartmannsdev.onlinebibliothek.utils.UserRole;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    // Create a new user with business rules based on permissions
    @Transactional
    public ResponseEntity<?> createNewUser(UserRequestDTO data) {
        // Get the authenticated user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof User)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not authenticated.");
        }
        User authenticatedUser = (User) authentication.getPrincipal();

        // Determine if the user has admin permission or IT support permission based on granted authorities
        boolean isAdmin = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("ROLE_ADMIN"));
        boolean isITSupport = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(auth -> auth.equals("PERM_ADD_STUDENT"));

        // Only users with admin permission or IT support permission can create new users
        if (!isAdmin && !isITSupport) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You do not have permission to create new users.");
        }

        // If the authenticated user is IT support (non-admin), apply restrictions:
        if (!isAdmin && isITSupport) {
            // Do not allow IT Support to create an ADMIN profile
            if (data.role() == UserRole.ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("IT Support users cannot create ADMIN profiles.");
            }
            // Validate that the provided school is the same as the IT Support's school
            if (!authenticatedUser.getSchools().getId().equals(data.schoolId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only create users for your own school.");
            }
        }

        // Check if a user with the same email already exists
        if (this.userRepository.findByEmail(data.email()) != null) {
            return ResponseEntity.badRequest().body("A user with this email already exists.");
        }

        // Retrieve the school and create the user
        Schools school = schoolRepository.findById(data.schoolId())
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + data.schoolId()));
        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());
        User user = new User(data, school, encryptedPassword);
        userRepository.save(user);
        return ResponseEntity.ok(new UserResponseDTO(user));
    }

    // Other service methods...

    public UserResponseDTO createUser(UserRequestDTO data) {
        Schools school = schoolRepository.findById(data.schoolId())
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + data.schoolId()));
        User user = new User(data, school, data.password());
        userRepository.save(user);
        return new UserResponseDTO(user);
    }

    // TODO: Remove password from the response.
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream().map(UserResponseDTO::new).toList();
    }
    // TODO: Remove password from the response.
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        return new UserResponseDTO(user);
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO data) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        Schools school = schoolRepository.findById(data.schoolId())
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + data.schoolId()));
        user.setName(data.name());
        user.setEmail(data.email());
        //user.setPassword(data.password());
        user.setRole(data.role());
        user.setSchools(school);
        userRepository.save(user);
        return new UserResponseDTO(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
        userRepository.delete(user);
    }
}

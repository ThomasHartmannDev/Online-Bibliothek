package com.hartmannsdev.onlinebibliothek.config;

import com.hartmannsdev.onlinebibliothek.model.User;
import com.hartmannsdev.onlinebibliothek.repository.UserRepository;
import com.hartmannsdev.onlinebibliothek.utils.UserRole;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "Admin@admin.com";
        // Verifica se já existe um usuário com o email Admin@admin.com
        if (userRepository.findByEmail(adminEmail) == null) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail(adminEmail);
            admin.setRole(UserRole.ADMIN);
            admin.setCreatedAt(LocalDateTime.now());
            // Criptografa a senha "Admin" antes de salvar
            admin.setPassword(passwordEncoder.encode("Admin"));
            // Se houver necessidade de associar a uma escola, você pode setar admin.setSchools(algumaEscola);
            userRepository.save(admin);
            System.out.println("Usuário Admin criado com sucesso!");
        } else {
            System.out.println("Usuário Admin já existe!");
        }
    }
}

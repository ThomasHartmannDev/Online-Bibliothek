package com.hartmannsdev.onlinebibliothek.controller;

import com.hartmannsdev.onlinebibliothek.DTO.auth.AuthDTO;
import com.hartmannsdev.onlinebibliothek.DTO.auth.AuthResponseDTO;
import com.hartmannsdev.onlinebibliothek.DTO.user.UserRequestDTO;
import com.hartmannsdev.onlinebibliothek.model.User;
import com.hartmannsdev.onlinebibliothek.repository.UserRepository;
import com.hartmannsdev.onlinebibliothek.security.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Validated AuthDTO data){

        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((User) auth.getPrincipal());

        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

}

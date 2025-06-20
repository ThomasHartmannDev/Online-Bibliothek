package com.hartmannsdev.onlinebibliothek.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.hartmannsdev.onlinebibliothek.model.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // Injeta o valor de 'api.security.token.secret' configurado no application.yml
    @Value("${api.security.token.secret}")
    private String secret;

    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer("auth-api")
                    .withSubject(user.getUsername())
                    .withClaim("role", user.getRole().name())  // Adiciona a role como claim
                    .withClaim("id", user.getId())
                    .withClaim("name", user.getName())
                    .withClaim("schoolId", (user.getSchools() != null && user.getSchools().getId() != null)
                            ? user.getSchools().getId()
                            : 0)
                    .withExpiresAt(genExpirationDate())
                    .sign(algorithm);

            return token;
        } catch (Exception e) {
            throw new RuntimeException("Error generating token", e);
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("auth-api")
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException e) {
            return "";
        }
    }

    private Instant genExpirationDate(){
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("+01:00"));
    }
}

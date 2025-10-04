package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dto.LoginRequest;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.User;
import com.example.backend.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {

    private final JwtConfig jwtConfig;

    public JwtService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }


    public Jwt generateAccessToken(User user){
        //final long tokenExpiration = 300; //5 min
        return generateToken(user, jwtConfig.getAccessTokenExpiration());
    }

    public Jwt generateRefreshToken(User user){
        //final long tokenExpiration = 604800; //7 days
        return generateToken(user, jwtConfig.getRefreshTokenExpiration());
    }

    private Jwt generateToken(User user, long tokenExpiration) {
        var claims = Jwts.claims()
                .subject(user.getEmail())
                .add("id", user.getId())
                .add("cin", user.getCin())
                .add("nom", user.getNom())
                .add("prenom", user.getPrenom())
                .add("role", user.getRole())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * tokenExpiration))
                .build();
        return new Jwt(claims, jwtConfig.getSecretKey());
    }
    public Jwt generateAccessToken(Long id, String email, String cin, String nom, String prenom, Role role) {
        return generateToken(id, email, cin, nom, prenom, role, jwtConfig.getAccessTokenExpiration());
    }

    public Jwt generateRefreshToken(Long id, String email, String cin, String nom, String prenom, Role role) {
        return generateToken(id, email, cin, nom, prenom, role, jwtConfig.getRefreshTokenExpiration());
    }

    private Jwt generateToken(Long id, String email, String cin, String nom, String prenom, Role role, long tokenExpiration) {
        var claims = Jwts.claims()
                .subject(email)
                .add("id", id)
                .add("cin", cin)
                .add("nom", nom)
                .add("prenom", prenom)
                .add("role", role.name()) // ✅ stocker une String pour être cohérent avec getRoleFromToken
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 1000 * tokenExpiration))
                .build();
        return new Jwt(claims, jwtConfig.getSecretKey());
    }
    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("id", Long.class);
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }



    /*public boolean validateToken(String token){
        try {
            var claims = getClaims(token);
            return claims.getExpiration().after(new Date());

        }catch (JwtException ex){
            return false;
        }
    }*/

    public Jwt parseToken(String token) {
        try {
            var claims = getClaims(token);
            return new Jwt(claims, jwtConfig.getSecretKey());
        } catch (JwtException e) {
            return null;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(jwtConfig.getSecretKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /*public Long getUserIdFromToken(String token){
        return Long.valueOf(getClaims(token).getSubject()) ;
    }*/

    public Role getRoleFromToken(String token){
        return Role.valueOf(getClaims(token).get("role", String.class));
    }
}

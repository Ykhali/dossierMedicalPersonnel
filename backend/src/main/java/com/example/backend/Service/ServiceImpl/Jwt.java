package com.example.backend.Service.ServiceImpl;

import com.example.backend.Entity.Enums.Role;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;

import javax.crypto.SecretKey;
import java.util.Date;

public class Jwt {
    private final Claims claims;
    private final SecretKey secretKey;

    public Jwt(Claims claims, SecretKey secretKey) {
        this.claims = claims;
        this.secretKey = secretKey;
    }

    public boolean isValid() {
        return claims.getExpiration().after(new Date());
    }

    public boolean isExpired() {
        return claims.getExpiration().before(new Date());
    }

    public Long getUserId() {
        //return Long.valueOf(claims.getSubject());
        return claims.get("Id", Long.class);
    }

    public String getUserEmail() {
        return claims.getSubject();
    }

    public Role getRole() {
        return Role.valueOf(claims.get("role", String.class));
    }

    public String getToken() {
        return Jwts.builder()
                .claims(claims)
                .signWith(secretKey)   // HS256 by default for HMAC keys (jjwt 0.12+)
                .compact();
    }

    public String toString(){
        return Jwts.builder().claims(claims).signWith(secretKey).compact();
    }
}

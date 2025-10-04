package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.PasswordResetTokenRepository;
import com.example.backend.Entity.PasswordResetToken;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;

@Service
public class PasswordResetService {
    @Autowired
    private PasswordResetTokenRepository repo;
    @Autowired
    private PasswordEncoder encoder;
    @Value("${app.resetTokenTtlMinutes:20}") long ttlMinutes;

    public String create(Long userId) {
        byte[] raw = new byte[48];
        new SecureRandom().nextBytes(raw);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
        String hash = encoder.encode(token);

        var t = new PasswordResetToken();
        t.setUserId(userId);
        t.setTokenHash(hash);
        t.setExpiresAt(Instant.now().plus(ttlMinutes, ChronoUnit.MINUTES));
        repo.save(t);
        return token; // raw token goes to the email link
    }

    public void ensureValid(Long userId, String rawToken) {
        var t = repo.findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new IllegalStateException("invalid"));
        if (Instant.now().isAfter(t.getExpiresAt())) throw new IllegalStateException("expired");
        if (!encoder.matches(rawToken, t.getTokenHash())) throw new IllegalStateException("invalid");
    }

    @Transactional
    public void consume(Long userId, String rawToken) {
        var t = repo.findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new IllegalStateException("invalid"));
        if (Instant.now().isAfter(t.getExpiresAt())) throw new IllegalStateException("expired");
        if (!encoder.matches(rawToken, t.getTokenHash())) throw new IllegalStateException("invalid");
        t.setUsedAt(Instant.now());
        repo.save(t);
    }
}


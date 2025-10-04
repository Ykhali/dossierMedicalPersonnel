package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.EmailOtpCodeRepository;
import com.example.backend.Entity.EmailOtpCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
public class EmailOtpService {
    @Autowired
    private EmailOtpCodeRepository repo;
    @Autowired
    private PasswordEncoder encoder;
    @Autowired
    private Mailer mailer;

    @Value("${app.emailOtpTtlMinutes:10}") long ttl;
    @Value("${app.emailOtpLength:6}") int len;
    @Value("${app.emailOtpResendSeconds:60}") long resendCooldown;
    @Value("${app.emailOtpMaxAttempts:5}") int maxAttempts;

    private String genNumericOtp(int n) {
        var r = new SecureRandom();
        StringBuilder sb = new StringBuilder(n);
        for (int i=0; i<n; i++) sb.append(r.nextInt(10));
        return sb.toString();
    }

    /* Envoie un nouveau code, avec anti-spam simple (cooldown) */
    @Transactional
    public void sendOtp(Long userId, String email) {
        var existing = repo.findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(userId).orElse(null);
        var now = Instant.now();

        if (existing != null && now.isBefore(existing.getLastSentAt().plus(resendCooldown, ChronoUnit.SECONDS))) {
            // trop tôt pour renvoyer — on renvoie silencieusement (pas d’erreur côté client).
            return;
        }

        String otp = genNumericOtp(len);
        String hash = encoder.encode(otp);

        EmailOtpCode rec = (existing != null) ? existing : new EmailOtpCode();
        rec.setUserId(userId);
        rec.setCodeHash(hash);
        rec.setExpiresAt(now.plus(ttl, ChronoUnit.MINUTES));
        rec.setUsedAt(null);
        rec.setAttempts(0);
        rec.setLastSentAt(now);
        repo.save(rec);

        String html = """
      <p>Voici votre code de vérification :</p>
      <p style="font-size:20px;font-weight:700;letter-spacing:2px">%s</p>
      <p>Il expire dans %d minutes. Ne partagez ce code avec personne.</p>
    """.formatted(otp, ttl);

        mailer.send(email, "Code de vérification", html);
    }

    /** Vérifie le code; si OK, consomme et retourne true. */
    @Transactional
    public boolean verifyOtp(Long userId, String rawCode) {
        var rec = repo.findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(userId).orElse(null);
        if (rec == null) return false;

        var now = Instant.now();
        if (rec.getUsedAt() != null || now.isAfter(rec.getExpiresAt())) return false;

        // tentative en plus (avant le test) pour bloquer brute force
        int attempts = rec.getAttempts() == null ? 0 : rec.getAttempts();
        if (attempts >= maxAttempts) return false;
        rec.setAttempts(attempts + 1);

        boolean ok = encoder.matches(rawCode, rec.getCodeHash());
        if (ok) {
            rec.setUsedAt(now);
            repo.save(rec);
            return true;
        } else {
            repo.save(rec);
            return false;
        }
    }
}

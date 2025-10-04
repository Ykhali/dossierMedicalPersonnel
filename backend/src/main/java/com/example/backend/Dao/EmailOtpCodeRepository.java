package com.example.backend.Dao;

import com.example.backend.Entity.EmailOtpCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;
import java.util.Optional;

public interface EmailOtpCodeRepository extends JpaRepository<EmailOtpCode, Long> {
    Optional<EmailOtpCode> findTopByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(Long userId);

    @Modifying
    @Query("delete from EmailOtpCode e where e.expiresAt < :now or e.usedAt is not null")
    int deleteExpired(Instant now);
}


package com.example.backend.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.Set;

@Service
public class FileStorageService {
    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED = Set.of("image/jpeg","image/png","image/webp");

    @PostConstruct
    void init() throws IOException {
        Files.createDirectories(Path.of(uploadDir));
    }

    public String saveProfileImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Empty file");
        String ct = file.getContentType();
        if (ct == null || !ALLOWED.contains(ct)) throw new IllegalArgumentException("Only jpeg/png/webp");

        Path destDir = Path.of(uploadDir, "profile");
        Files.createDirectories(destDir);

        String ext = Optional.ofNullable(file.getOriginalFilename())
                .filter(n -> n.contains("."))
                .map(n -> n.substring(n.lastIndexOf('.')))
                .orElse("");
        String filename = System.currentTimeMillis() + "_" + java.util.UUID.randomUUID() + ext;

        try (var in = file.getInputStream()) {
            Files.copy(in, destDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        }
        // Public URL (Spring serves from /files/**)
        return "/files/profile/" + filename;
    }
}


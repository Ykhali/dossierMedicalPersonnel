package com.example.backend.Service.ServiceImpl;

import com.example.backend.Dao.UserPhotoRepository;
import com.example.backend.Dao.UserRepository;
import com.example.backend.Entity.User;
import com.example.backend.Entity.UserPhoto;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Duration;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
public class UserPhotoService {

    private static final long MAX_BYTES = 2 * 1024 * 1024; // 2 Mo
    private static final Set<String> ALLOWED = Set.of("image/jpeg", "image/png", "image/webp");

    private final UserRepository userRepository;
    private final UserPhotoRepository userPhotoRepository;

    public UserPhotoService(UserRepository userRepository, UserPhotoRepository userPhotoRepository) {
        this.userRepository = userRepository;
        this.userPhotoRepository = userPhotoRepository;
    }

    public void uploadOrReplace(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) throw new IllegalArgumentException("Fichier manquant");
        String ct = file.getContentType();
        if (ct == null || !ALLOWED.contains(ct)) {
            throw new IllegalArgumentException("Formats acceptés: JPEG / PNG / WEBP");
        }
        if (file.getSize() > MAX_BYTES) {
            throw new IllegalArgumentException("Taille max 2 Mo");
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new NoSuchElementException("Utilisateur introuvable"));

        UserPhoto photo = userPhotoRepository.findByUserId(userId).orElseGet(UserPhoto::new);
        photo.setUser(user);
        try {
            photo.setData(file.getBytes());
        } catch (IOException e) {
            throw new IllegalArgumentException("Lecture de fichier impossible: " + e.getMessage());
        }
        photo.setContentType(ct);
        photo.setFilename(org.springframework.util.StringUtils.cleanPath(file.getOriginalFilename()));
        photo.setSize(file.getSize());

        userPhotoRepository.save(photo);
    }

    public ResponseEntity<byte[]> download(Long userId) {
        UserPhoto photo = userPhotoRepository.findByUserId(userId)
                .orElseThrow(() -> new NoSuchElementException("Photo introuvable"));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(
                photo.getContentType() != null ? photo.getContentType() : "application/octet-stream"));
        if (photo.getFilename() != null) {
            headers.setContentDisposition(ContentDisposition.inline().filename(photo.getFilename()).build());
        } else {
            headers.setContentDisposition(ContentDisposition.inline().filename("photo").build());
        }
        headers.setCacheControl(CacheControl.maxAge(Duration.ofDays(7)).cachePublic());
        return new ResponseEntity<>(photo.getData(), headers, HttpStatus.OK);
    }

    public void delete(Long userId) {
        if (!userPhotoRepository.existsByUserId(userId)) return;
        userPhotoRepository.deleteByUserId(userId);
    }

    public boolean hasPhoto(Long userId) {
        return userPhotoRepository.existsByUserId(userId);
    }
}


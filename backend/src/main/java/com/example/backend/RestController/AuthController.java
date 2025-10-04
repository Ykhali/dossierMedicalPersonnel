package com.example.backend.RestController;

import com.example.backend.Dao.PatientRepository;
import com.example.backend.Dao.UserRepository;
import com.example.backend.Dto.*;
import com.example.backend.Entity.Enums.Role;
import com.example.backend.Entity.User;
import com.example.backend.Service.ServiceImpl.EmailOtpService;
import com.example.backend.Service.ServiceImpl.JwtService;
import com.example.backend.Service.ServiceImpl.Mailer;
import com.example.backend.Service.ServiceImpl.PasswordResetService;
import com.example.backend.config.JwtConfig;
import com.example.backend.mapper.MedecinDTOMapper;
import com.example.backend.mapper.PatientDTOMapper;
import com.example.backend.mapper.UserDtoMapper;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.validation.Valid;
import java.io.InputStream;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserDtoMapper userDtoMapper;
    @Autowired
    private JwtConfig jwtConfig;
    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PatientDTOMapper patientDTOMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private PasswordResetService passwordResetService;
    @Autowired
    protected Mailer mailer;
    @Autowired private EmailOtpService emailOtpService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @Value("${app.frontendBaseUrl}")
    private String frontendBase;

    public record ForgotReq(String email) {}
    public record ValidateReq(String email, String token) {}
    public record ResetReq(String email, String token, String newPassword) {}
    public record SendEmailOtpReq(String email) {}
    public record VerifyEmailOtpReq(String email, String code) {}



    // ---------- JSON version (what you're sending from Postman screenshot) ----------
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> registerJson(
            @Valid @RequestBody AddPatientDto request,
            UriComponentsBuilder uriBuilder
    ) {
        if (request.getMotdepasse() == null || !request.getMotdepasse().equals(request.getConfirmpwd())) {
            return ResponseEntity.badRequest().body(Map.of("MotDePasse", "Les mot de passe ne correspondent pas"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("email", "E-mail déja enregistrer."));
        }

        var user = userDtoMapper.toEntity(request);       // mapper ignores target 'image'
        user.setMotdepasse(passwordEncoder.encode(request.getMotdepasse()));
        user.setPasswordlength(request.getMotdepasse().length());
        user.setRole(Role.PATIENT);
        user.setImage(null);// no file in JSON flow
        user.setDatedenaissance(request.getDatedenaissance());

        userRepository.save(user);
        var dto = userDtoMapper.toDto(user);
        var uri = uriBuilder.path("/patients/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }

    // ---------- multipart version (if/when you send a file) ----------
    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerMultipart(
            @Valid @ModelAttribute AddPatientDto request,
            UriComponentsBuilder uriBuilder
    ) {
        if (request.getMotdepasse() == null || !request.getMotdepasse().equals(request.getConfirmpwd())) {
            return ResponseEntity.badRequest().body(Map.of("MotDePasse", "Les mot de passe ne correspondent pas"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("email", "E-mail déja enregistrer."));
        }

        var user = patientDTOMapper.toEntity(request);       // mapper must ignore 'image'
        user.setMotdepasse(passwordEncoder.encode(request.getMotdepasse()));
        user.setPasswordlength(request.getMotdepasse().length());
        user.setRole(Role.PATIENT);
        user.setNomComplet(request.getPrenom() + " " + request.getNom());
        user.setDatedenaissance(request.getDatedenaissance());

        var file = request.getImage();                    // MultipartFile from DTO
        if (file != null && !file.isEmpty()) {
            var allowed = java.util.Set.of("image/jpeg","image/png","image/webp");
            var ct = file.getContentType();
            if (ct == null || !allowed.contains(ct)) {
                return ResponseEntity.badRequest().body(Map.of("image", "Formats acceptés: JPEG / PNG / WEBP"));
            }
            if (file.getSize() > 2 * 1024 * 1024) {
                return ResponseEntity.badRequest().body(Map.of("image", "Taille max 2 Mo"));
            }
            try (var in = file.getInputStream()) {
                var base = java.nio.file.Paths.get(uploadDir);
                java.nio.file.Files.createDirectories(base);
                var dir = base.resolve("profile");
                java.nio.file.Files.createDirectories(dir);

                var original = org.springframework.util.StringUtils
                        .cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
                var ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) :
                        switch (ct) { case "image/png" -> ".png"; case "image/webp" -> ".webp"; default -> ".jpg"; };
                var filename = System.currentTimeMillis() + "_" + java.util.UUID.randomUUID() + ext;

                java.nio.file.Files.copy(in, dir.resolve(filename), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                user.setImage("/files/profile/" + filename); // store public URL only
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("image", "Erreur enregistrement: " + e.getMessage()));
            }
        }

        patientRepository.save(user);
        var dto = patientDTOMapper.toDto(user);
        var uri = uriBuilder.path("/patients/{id}").buildAndExpand(dto.getId()).toUri();
        return ResponseEntity.created(uri).body(dto);
    }
    // Helper for extension if original filename has none
    private String guessExt(String contentType) {
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }

    /*@PostMapping(value="/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @Valid @ModelAttribute AddPatientDto request,  // <-- multipart binder
            UriComponentsBuilder uriBuilder,
            @Value("${app.upload.dir}") String uploadDir
    ) {
        // 1) Validations
        if (request.getMotdepasse() == null || !request.getMotdepasse().equals(request.getConfirmpwd())) {
            return ResponseEntity.badRequest()
                    .body(Map.of("MotDePasse","Les mot de passe ne correspondent pas"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("email", "E-mail déja enregistrer."));
        }

        // 2) Map DTO -> Entity
        var user = patientDTOMapper.toEntity(request);
        user.setMotdepasse(passwordEncoder.encode(request.getMotdepasse()));
        user.setRole(Role.PATIENT);

        // 3) Récupérer le fichier depuis le DTO parent RegisterUserRequest
        MultipartFile photo = request.getImage(); // <input name="image" ...>

        if (photo != null && !photo.isEmpty()) {
            final String ct = photo.getContentType();
            if (ct == null || !(ct.equals("image/jpeg") || ct.equals("image/png") || ct.equals("image/webp"))) {
                return ResponseEntity.badRequest().body(Map.of("image", "Formats acceptés: JPEG / PNG / WEBP"));
            }
            if (photo.getSize() > 2 * 1024 * 1024) { // 2 Mo
                return ResponseEntity.badRequest().body(Map.of("image", "Taille max 2 Mo"));
            }

            try {
                // Dossiers: <uploadDir>/profile
                Path base = Paths.get(uploadDir);
                Files.createDirectories(base);
                Path targetDir = base.resolve("profile");
                Files.createDirectories(targetDir);

                // Nom de fichier sûr
                String original = org.springframework.util.StringUtils
                        .cleanPath(photo.getOriginalFilename() == null ? "" : photo.getOriginalFilename());
                String ext = original.contains(".") ? original.substring(original.lastIndexOf('.')) : guessExt(ct);
                String filename = System.currentTimeMillis() + "_" + UUID.randomUUID() + ext;

                // Copie vers disque
                try (InputStream in = photo.getInputStream()) {
                    Files.copy(in, targetDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
                }

                // En BDD: on stocke seulement l'URL publique
                user.setImage("/files/profile/" + filename);

            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("image", "Erreur enregistrement: " + e.getMessage()));
            }
        } else {
            user.setImage(null);
        }

        // 4) Persist & réponse
        userRepository.save(user);
        var userDto = patientDTOMapper.toDto(user);
        var uri = uriBuilder.path("/patients/{id}").buildAndExpand(userDto.getId()).toUri();
        return ResponseEntity.created(uri).body(userDto);
    }

    // petite aide pour l'extension
    private String guessExt(String contentType) {
        return switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            default -> ".jpg";
        };
    }*/


    /*@PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @Valid @RequestBody AddPatientDto request,
            UriComponentsBuilder uriBuilder) {
        if (request.getMotdepasse().equals(request.getConfirmpwd())){
            if (userRepository.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("email", "E-mail déja enregistrer."));
            }
            var user = patientDTOMapper.toEntity(request);
            user.setMotdepasse(passwordEncoder.encode(user.getMotdepasse()));
            user.setRole(Role.PATIENT);
            userRepository.save(user);

            var userDto = patientDTOMapper.toDto(user);
            var uri = uriBuilder.path("/patients/{id}").buildAndExpand(userDto.getId()).toUri();
            return ResponseEntity.created(uri).body(userDto);

        }else {
            return ResponseEntity.badRequest()
                    .body(Map.of("MotDePasse","Les mot de passe ne correspondent pas"));
        }
    }*/
    /*@PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @Valid @RequestPart("user") AddPatientDto request,
            @RequestPart(name = "photoIdentite", required = false) MultipartFile photo,
            UriComponentsBuilder uriBuilder
    ){
        //verification
        if(!request.getMotdepasse().equals(request.getConfirmpwd())){
            return ResponseEntity.badRequest()
                    .body(Map.of("MotDePasse","Les mot de passe ne correspondent pas"));
        }
        if(userRepository.existsByEmail(request.getEmail())){
            return ResponseEntity.badRequest().body(Map.of("email", "E-mail déja enregistrer."));
        }
        var user = patientDTOMapper.toEntity(request);
        user.setMotdepasse(passwordEncoder.encode(request.getMotdepasse()));
        user.setRole(Role.PATIENT);

        try {
            if (photo != null && !photo.isEmpty()) {
                String contentType = photo.getContentType();
                if (contentType == null ||
                        !(contentType.equals("image/jpeg") ||
                          contentType.equals("image/png") ||
                          contentType.equals("image/webp"))) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("photo", "Formats acceptés: JPEG / PNG / WEBP"));
                }
                if (photo.getSize() > (2 * 1024 * 1024)) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("photo", "Taille max 2 Mo"));
                }
                user.setPhotoIdentite(photo.getBytes());
                user.setPhotoContentType(contentType);
                user.setPhotoFilename(StringUtils.cleanPath(
                        photo.getOriginalFilename()));
                user.setPhotoSize(photo.getSize());
            }
        } catch (Exception e){
            return ResponseEntity.badRequest()
                    .body(Map.of("photo", "Lecture de fichier impossible: " + e.getMessage()));
        }
        userRepository.save(user);
        var userDto = patientDTOMapper.toDto(user);
        var uri = uriBuilder.path("/patients/{id}").buildAndExpand(userDto.getId()).toUri();
        return ResponseEntity.created(uri).body(userDto);

    }*/

    /*@PostMapping(value="/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> registerUser(
            @Valid @ModelAttribute AddPatientDto request,
            @RequestPart(name = "photoIdentite", required = false) MultipartFile photo,
            UriComponentsBuilder uriBuilder
    ){
        if (!request.getMotdepasse().equals(request.getConfirmpwd())) {
            return ResponseEntity.badRequest().body(Map.of("motdepasse","Les mot de passe ne correspondent pas"));
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("email", "E-mail déja enregistrer."));
        }

        var user = patientDTOMapper.toEntity(request);
        System.out.println(user.getMotdepasse());
        System.out.println("mot de passe: "+ request.getMotdepasse());
        user.setMotdepasse(passwordEncoder.encode(request.getMotdepasse()));
        user.setRole(Role.PATIENT);

        try {
            if (photo != null && !photo.isEmpty()) {
                String contentType = photo.getContentType();
                if (contentType == null ||
                        !(contentType.equals("image/jpeg") ||
                                contentType.equals("image/png") ||
                                contentType.equals("image/webp"))) {
                    return ResponseEntity.badRequest().body(Map.of("photo","Formats acceptés: JPEG / PNG / WEBP"));
                }
                if (photo.getSize() > 2 * 1024 * 1024) {
                    return ResponseEntity.badRequest().body(Map.of("photo","Taille max 2 Mo"));
                }
                user.setPhotoIdentite(photo.getBytes());
                user.setPhotoContentType(contentType);
                user.setPhotoFilename(org.springframework.util.StringUtils.cleanPath(photo.getOriginalFilename()));
                user.setPhotoSize(photo.getSize());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("photo", "Lecture de fichier impossible: " + e.getMessage()));
        }

        userRepository.save(user);
        var userDto = patientDTOMapper.toDto(user);
        var uri = uriBuilder.path("/patients/{id}").buildAndExpand(userDto.getId()).toUri();
        return ResponseEntity.created(uri).body(userDto);
    }*/

    /*@PostMapping("/login")
    public ResponseEntity<JwtResponse> login(
            @Valid @RequestBody  LoginRequest request,
            HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getMotdepasse()
                )
        );
        var user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        System.out.println(user);
        var accessToken = jwtService.generateAccessToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);

        var cookie = new Cookie("refreshToken", refreshToken.toString());
        cookie.setHttpOnly(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration());//expires after 7 days
        cookie.setSecure(true);
        response.addCookie(cookie);

        return ResponseEntity.ok(new JwtResponse(accessToken.toString()));
    }*/
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response) {

        // 1) Charger UNIQUEMENT les champs d'auth (sans BLOB)
        var auth = userRepository.findAuthByEmail(request.getEmail())
                .orElseThrow(() -> new org.springframework.security.authentication.BadCredentialsException("Bad credentials"));

        if(Boolean.TRUE.equals(auth.getDeleted())){
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(new ApiError("ACCOUNT_DELETED", "Votre compte est désactivé."));
        }
        // 2) Vérifier le mot de passe (sans AuthenticationManager)
        if (!passwordEncoder.matches(request.getMotdepasse(), auth.getMotdepasse())) {
            throw new org.springframework.security.authentication.BadCredentialsException("Bad credentials");
        }

        // 3) Générer des JWT sans passer l'entité (donc aucun BLOB)
        var accessToken  = jwtService.generateAccessToken(
                auth.getId(), auth.getEmail(), auth.getCin(), auth.getNom(), auth.getPrenom(), auth.getRole()
        );
        var refreshToken = jwtService.generateRefreshToken(
                auth.getId(), auth.getEmail(), auth.getCin(), auth.getNom(), auth.getPrenom(), auth.getRole()
        );

        // 4) Déposer le refresh en cookie
        var cookie = new Cookie("refreshToken", refreshToken.toString());
        cookie.setHttpOnly(true);
        cookie.setPath("/auth/refresh");
        cookie.setMaxAge(jwtConfig.getRefreshTokenExpiration());
        cookie.setSecure(true); // en local HTTP: false
        response.addCookie(cookie);

        return ResponseEntity.ok(new JwtResponse(accessToken.toString()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgot(@RequestBody ForgotReq req){
        String email = req.email() == null ? "" : req.email().trim();

        // Always reply generically to avoid email enumeration
        userRepository.findByEmail(email).ifPresent(u -> {
            String token = passwordResetService.create(u.getId());
            String link = frontendBase + "/reset-password?token="
                    + java.net.URLEncoder.encode(token, java.nio.charset.StandardCharsets.UTF_8)
                    + "&email=" + java.net.URLEncoder.encode(email, java.nio.charset.StandardCharsets.UTF_8);
            String html = """
          <p>Vous avez demandé la réinitialisation du mot de passe.</p>
          <p><a href="%s">Réinitialiser mon mot de passe</a></p>
          <p>Ce lien expirera bientôt.</p>
        """.formatted(link);
            mailer.send(email, "Réinitialisation du mot de passe", html);
        });

        return ResponseEntity.ok(Map.of("message", "Si un compte existe, un lien de réinitialisation a été envoyé."));
    }
    @PostMapping("/reset-password/validate")
    public ResponseEntity<?> validate(@RequestBody ValidateReq req) {
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));
        passwordResetService.ensureValid(user.getId(), req.token());
        return ResponseEntity.ok(Map.of("ok", true));
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> reset(@RequestBody ResetReq req) {
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));

        passwordResetService.consume(user.getId(), req.token());

        user.setMotdepasse(passwordEncoder.encode(req.newPassword()));
        user.setPasswordlength(req.newPassword().length());
        // (Optional) logout-all: increment token version if you add that column
        // user.setTokenVersion(user.getTokenVersion() + 1);
        userRepository.save(user);

        mailer.send(user.getEmail(), "Votre mot de passe a été modifié",
                "<p>Si vous n'êtes pas à l'origine de cette action, contactez le support immédiatement.</p>");

        return ResponseEntity.ok(Map.of("message", "Mot de passe mis à jour"));
    }

    @PostMapping("/email-otp/send")
    public ResponseEntity<?> sendEmailOtp(@RequestBody SendEmailOtpReq req) {
        String email = (req.email()==null? "": req.email().trim());
        // Répondre OK même si l’email n’existe pas -> pas d’énumération
        userRepository.findByEmail(email).ifPresent(u -> {
            // si déjà vérifié, tu peux décider de ne pas renvoyer
            if (u.getEmailVerifiedAt() == null) {
                emailOtpService.sendOtp(u.getId(), email);
            }
        });
        return ResponseEntity.ok(Map.of("message", "Si un compte existe, un code a été envoyé."));
    }

    @PostMapping("/email-otp/verify")
    public ResponseEntity<?> verifyEmailOtp(@RequestBody VerifyEmailOtpReq req) {
        var user = userRepository.findByEmail(req.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST));
        boolean ok = emailOtpService.verifyOtp(user.getId(), req.code());
        if (!ok) return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error","Code invalide ou expiré"));

        // marquer l'email comme vérifié
        user.setEmailVerifiedAt(LocalDateTime.now());

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("verified", true));
    }


    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)           // keep same as when you set it
                .path("/auth/refresh")  // MUST match creation path
                .maxAge(0)              // delete immediately
                // .sameSite("None")    // add if you used it when setting
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refresh(
            @CookieValue(value = "refreshToken") String refreshToken
    ){
        var jwt = jwtService.parseToken(refreshToken);
        if (jwt == null || jwt.isExpired()){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        var user = userRepository.findById(jwt.getUserId()).orElseThrow();
        var accessToken = jwtService.generateAccessToken(user);

        return ResponseEntity.ok(new JwtResponse(accessToken.toString()));
    }

    /*@GetMapping("/moi")
    public ResponseEntity<UserDto> moi(){
        //Extracting the current principal
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        var userId = (Long) authentication.getPrincipal();

        //look up the user
        var user = userRepository.findById(userId).orElse(null);
        if(user == null){
            return ResponseEntity.notFound().build();
        }

        //Map the user
        var userDto = userDtoMapper.toDto(user);

        //return the result
        return ResponseEntity.ok(userDto);

    }*/
    /*@GetMapping("/moi")
    public ResponseEntity<UserDto> moi() {
        // 1. Récupérer l'authentification
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        // 2. Extraire l'email à partir du principal
        String email = (String) authentication.getPrincipal();

        // 3. Chercher l'utilisateur par email
        var user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        // 4. Mapper l'utilisateur vers le DTO
        var userDto = userDtoMapper.toDto(user);

        // 5. Retourner la réponse
        return ResponseEntity.ok(userDto);
    }*/
    @GetMapping("/moi")
    public ResponseEntity<UserDto> moi() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName(); // plus robuste que cast du principal

        var view = userRepository.findAuthByEmail(email).orElse(null);
        if (view == null) return ResponseEntity.notFound().build();

        // ↘️ Mappe "à la main" pour éviter de toucher à ton mapper existant
        var dto = new UserDto();
        dto.setId(view.getId());
        dto.setTelephone(view.getTelephone());
        dto.setNom(view.getNom());
        dto.setPrenom(view.getPrenom());
        dto.setCin(view.getCin());
        dto.setEmail(view.getEmail());
        dto.setRole(view.getRole());
        // ⚠️ ne remplis pas les champs photo dans ce DTO

        return ResponseEntity.ok(dto);
    }


    /*@GetMapping("/moi")
    public ResponseEntity<UserDto> moi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            logger.warn("Authentication is null or not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Object principal = authentication.getPrincipal();
        logger.info("Principal type: {}", principal.getClass().getName());
        logger.info("Principal value: {}", principal);

        String email;
        if (principal instanceof String) {
            email = (String) principal;
        } else if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            logger.error("Unsupported principal type: {}", principal.getClass().getName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        var user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            logger.warn("User not found for email: {}", email);
            return ResponseEntity.notFound().build();
        }

        var userDto = userDtoMapper.toDto(user);
        return ResponseEntity.ok(userDto);
    }*/


    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Void> handleBadCredentialsException(){
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}

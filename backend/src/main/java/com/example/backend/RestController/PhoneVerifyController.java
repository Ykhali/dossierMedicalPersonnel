package com.example.backend.RestController;

// PhoneVerifyController.java
import com.example.backend.Dao.UserRepository;
import com.example.backend.Service.ServiceImpl.PhoneUtil;
import com.example.backend.Service.ServiceImpl.PhoneVerifyService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.OffsetDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/phone")
public class PhoneVerifyController {

    private final PhoneVerifyService verifyService;
    private final UserRepository userRepo;

    public PhoneVerifyController(PhoneVerifyService v, UserRepository ur){
        this.verifyService = v; this.userRepo = ur;
    }

    // helper: récupère l'email depuis le token (adapté à ta conf)
    private String currentEmail() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        return auth == null ? null : auth.getName(); // si username=email
    }

    public record StartReq(String phone) {}
    public record VerifyReq(String phone, String code) {}

    // Démarrer l'envoi de code SMS
    /*@PostMapping("/start")
    public ResponseEntity<?> start(@RequestBody StartReq req) {
        // 1) normaliser en E.164
        String e164 = PhoneUtil.toE164(req.phone(), "MA");

        // 2) attacher le numéro au user connecté (si tu veux l’enregistrer tout de suite)
        var user = userRepo.findByEmail(currentEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
        user.setTelephone(e164);
        userRepo.save(user);

        // 3) envoyer l’OTP
        verifyService.sendCodeSms(e164);
        return ResponseEntity.ok(Map.of("sent", true));
    }*/

    // Vérifier le code reçu par SMS
    /*@PostMapping("/verify")
    public ResponseEntity<?> verify(@RequestBody VerifyReq req) {
        String e164 = PhoneUtil.toE164(req.phone(), "MA");
        boolean ok = verifyService.checkCode(e164, req.code());
        if (!ok) return ResponseEntity.badRequest().body(Map.of("error","Code invalide"));

        var user = userRepo.findByEmail(currentEmail())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // on sécurise: on ne valide QUE si le phone correspond à celui stocké
        if (user.getTelephone() == null || !user.getTelephone().equals(e164)) {
            return ResponseEntity.badRequest().body(Map.of("error","Numéro différent de celui demandé"));
        }

        user.setTelephoneVerifiedAt(OffsetDateTime.now());
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("verified", true, "telephone", e164));
    }*/
}


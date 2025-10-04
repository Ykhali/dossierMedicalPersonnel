package com.example.backend.Service.ServiceImpl;

import com.example.backend.Entity.Facture;
import com.example.backend.Entity.FactureLigne;
import com.example.backend.Entity.Patient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.thymeleaf.context.Context;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

/*
@Service
public class FacturePdfService {
    private final TemplateEngine templateEngine;

    @Value("${app.files.factures}")
    private String facturesDir;

    public FacturePdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] renderToBytes(Facture facture, List<FactureLigne> lignes) throws Exception {
        Context ctx = new Context();
        ctx.setVariable("facture", facture);
        ctx.setVariable("lignes", lignes);

        String html = templateEngine.process("facture-template", ctx);

        // Base URI => permet de charger assets/bootstrap.min.css
        String baseUri = Objects.requireNonNull(
                getClass().getResource("/templates/")
        ).toExternalForm();

        try (var out = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, baseUri);
            builder.toStream(out);
            builder.run();
            return out.toByteArray();
        }
    }

    public String renderToFile(Facture facture, List<FactureLigne> lignes) throws Exception {
        byte[] pdf = renderToBytes(facture, lignes);
        File dir = new File(facturesDir);
        if (!dir.exists()) dir.mkdirs();
        String name = "facture-" + facture.getNumero() + ".pdf";
        File target = new File(dir, name);
        try (var fos = new FileOutputStream(target)) { fos.write(pdf); }
        return target.getAbsolutePath();
    }


}*/

/*
@Service
public class FacturePdfService {

    private final TemplateEngine templateEngine;

    // Dossier cible configuré dans application.properties / application.yml
    @Value("${app.files.factures:files/factures}")
    private String facturesDir;

    public FacturePdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] renderToBytes(Facture facture, List<FactureLigne> lignes) throws Exception {
        Context ctx = new Context();
        ctx.setVariable("facture", facture);
        ctx.setVariable("lignes", lignes != null ? lignes : List.of());

        // Le template doit exister dans src/main/resources/templates/facture-template.html
        String html = templateEngine.process("facture-template", ctx);

        // Base URI pour que <link href="..."> et <img src="..."> relatifs fonctionnent
        String baseUri = Objects.requireNonNull(
                getClass().getResource("/templates/")
        ).toExternalForm();

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfRendererBuilder builder = new PdfRendererBuilder();
            builder.useFastMode();
            builder.withHtmlContent(html, baseUri);
            builder.toStream(out);
            builder.run();
            return out.toByteArray();
        }
    }
    public String renderToFile(Facture facture, List<FactureLigne> lignes) throws Exception {
        byte[] pdf = renderToBytes(facture, lignes);

        File dir = new File(facturesDir);
        if (!dir.exists() && !dir.mkdirs()) {
            throw new IllegalStateException("Impossible de créer le dossier des factures: " + dir.getAbsolutePath());
        }

        // Nom de fichier
        String num = (facture.getNumero() != null && !facture.getNumero().isBlank())
                ? facture.getNumero()
                : String.valueOf(facture.getId());
        File target = new File(dir, "facture-" + num + ".pdf");

        try (FileOutputStream fos = new FileOutputStream(target)) {
            fos.write(pdf);
        }
        return target.getAbsolutePath();
    }
}*/

/*
@Service
public class FacturePdfService {

    private final TemplateEngine templateEngine;*/

    /** Racine DISQUE où tu stockes “files/…” (ex: C:/.../backend/files) */
   /* @Value("${app.files.root}")
    private String filesRoot; // <— à définir dans application.yml

    public FacturePdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }
*/
    /** Génère le PDF en mémoire */
  /* public byte[] renderToBytes(Facture f, List<FactureLigne> lignes) {
        Objects.requireNonNull(filesRoot, "app.files.root n'est pas configuré");

        // 1) Dossier racine des uploads (disque)
        Path uploadRoot = Paths.get(filesRoot).toAbsolutePath().normalize(); // ex: C:\...\backend\files

        // 2) Construire le logoSrc utilisable par le template (PAS de @{}, pas d’IWebContext requis)
        String logoSrc = buildLogoSrc(f, uploadRoot);

        // 3) Contexte Thymeleaf offline
        Context ctx = new Context(Locale.FRENCH);
        ctx.setVariable("facture", f);
        ctx.setVariable("lignes", (lignes != null ? lignes : List.of()));
        ctx.setVariable("logoSrc", logoSrc);

        String html = templateEngine.process("facture-template", ctx);

        // 4) baseUri = racine fichiers (pour résoudre les chemins RELATIFS éventuels)
        String baseUri = uploadRoot.toUri().toString(); // file:/C:/.../backend/files/

        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PdfRendererBuilder b = new PdfRendererBuilder();
            b.useFastMode();
            b.withHtmlContent(html, baseUri);
            b.toStream(out);
            b.run();
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Erreur de génération PDF", e);
        }
    }*/

    /** Génère et SAUVEGARDE le PDF sur disque, renvoie le chemin absolu */
   /* public String renderToFile(Facture f, List<FactureLigne> lignes) {
        byte[] pdf = renderToBytes(f, lignes);

        // On sauvegarde sous {app.files.root}/factures
        Path facturesDir = Paths.get(filesRoot).resolve("factures").toAbsolutePath().normalize();
        try {
            Files.createDirectories(facturesDir);
        } catch (Exception e) {
            throw new IllegalStateException("Impossible de créer le dossier des factures: " + facturesDir, e);
        }

        // Nom de fichier
        String num = (f.getNumero() != null && !f.getNumero().isBlank())
                ? f.getNumero()
                : String.valueOf(f.getId());
        Path target = facturesDir.resolve("facture-" + safeFilename(num) + ".pdf");

        try (FileOutputStream fos = new FileOutputStream(target.toFile())) {
            fos.write(pdf);
        } catch (Exception e) {
            throw new RuntimeException("Impossible d'écrire le PDF: " + target, e);
        }
        return target.toAbsolutePath().toString();
    }
*/
    // -------------------- Helpers --------------------

    /**
     * Construit une URL utilisable dans <img th:src="${logoSrc}"> :
     * - Si logoUrl commence par http(s), on retourne tel quel
     * - Sinon, on construit une file://… encodée depuis uploadRoot
     * - Gère le préfixe "/files" et les espaces
     */
    /*private String buildLogoSrc(Facture f, Path uploadRoot) {
        try {
            String raw = (f != null && f.getMedecin() != null) ? f.getMedecin().getLogoUrl() : null;
            if (raw == null || raw.isBlank()) return "";

            String trimmed = raw.trim();

            // 1) URL absolue HTTP(S) → on renvoie tel quel
            if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                return trimmed;
            }

            // 2) On enlève le slash de tête si présent
            String rel = trimmed.startsWith("/") ? trimmed.substring(1) : trimmed; // "files/medecins/.../img.png" ou "medecins/.."

            // 3) Si rel commence par "files/", on l’enlève car uploadRoot POINTE déjà vers /files
            String relToRoot = rel.replaceFirst("^files[/\\\\]", ""); // "medecins/.../img.png"

            Path logoPath = uploadRoot.resolve(relToRoot).normalize();
            if (!Files.exists(logoPath)) {
                // Option: retourner une data URI vide pour forcer le fallback
                return "";
            }

            // 4) Convertir en URI encodée (gère espaces → %20)
            return logoPath.toUri().toString(); // file:/C:/.../%20...
        } catch (Exception e) {
            // En cas de pépin, on retourne vide pour activer le fallback "LOGO"
            return "";
        }
    }*/

    /** Nettoie un nom de fichier (évite caractères exotiques) */
    /*private String safeFilename(String input) {
        return input.replaceAll("[^A-Za-z0-9._-]", "_");
    }
}*/
    @Service
    public class FacturePdfService {

        private final TemplateEngine templateEngine;

        // Racine DISQUE des fichiers (sert /files/**)
        @Value("${app.upload.dir}")
        private String uploadDir; // ex: C:/.../project/uploads  (ou /home/..../uploads)

        public FacturePdfService(TemplateEngine templateEngine) {
            this.templateEngine = templateEngine;
        }

        /** Génère le PDF en mémoire */
        public byte[] renderToBytes(Facture f, List<FactureLigne> lignes) {
            Path uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize(); // DISQUE

            // -- Construire logoSrc : URL utilisable dans <img th:src="${logoSrc}">
            String logoSrc = buildLogoSrcFromDbValue(
                    (f != null && f.getMedecin() != null) ? f.getMedecin().getLogoUrl() : null,
                    uploadRoot
            );

            Context ctx = new Context(Locale.FRENCH);
            ctx.setVariable("facture", f);
            ctx.setVariable("lignes", (lignes != null ? lignes : List.of()));
            ctx.setVariable("logoSrc", logoSrc); // <— pas de @{...} dans le template

            String html = templateEngine.process("facture-template", ctx);

            String baseUri = uploadRoot.toUri().toString(); // file:/.../uploads/

            try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
                PdfRendererBuilder b = new PdfRendererBuilder();
                b.useFastMode();
                b.withHtmlContent(html, baseUri); // résout tout chemin RELATIF contre /uploads
                b.toStream(out);
                b.run();
                return out.toByteArray();
            } catch (Exception e) {
                throw new RuntimeException("Erreur de génération PDF", e);
            }
        }

        /** Sauvegarde sous {app.upload.dir}/factures/facture-<num>.pdf */
        /*public String renderToFile(Facture f, List<FactureLigne> lignes) {
            byte[] pdf = renderToBytes(f, lignes);
            Path facturesDir = Paths.get(uploadDir).resolve("factures").toAbsolutePath().normalize();
            try {
                Files.createDirectories(facturesDir);
            } catch (Exception e) {
                throw new IllegalStateException("Impossible de créer le dossier des factures: " + facturesDir, e);
            }

            String num = (f.getNumero() != null && !f.getNumero().isBlank()) ? f.getNumero() : String.valueOf(f.getId());
            Path target = facturesDir.resolve("facture-" + safeFilename(num) + ".pdf");

            try (FileOutputStream fos = new FileOutputStream(target.toFile())) {
                fos.write(pdf);
            } catch (Exception e) {
                throw new RuntimeException("Impossible d'écrire le PDF: " + target, e);
            }
            return target.toString();
        }*/
        /*public String renderToFile(Facture f, List<FactureLigne> lignes) {
            byte[] pdf = renderToBytes(f, lignes);

            // dossier cible : {app.upload.dir}/factures
            Path facturesDir = Paths.get(uploadDir).resolve("factures").toAbsolutePath().normalize();

            try {
                // crée le dossier (et ses parents) s’il n’existe pas
                Files.createDirectories(facturesDir);
            } catch (IOException e) {
                throw new IllegalStateException("Impossible de créer le dossier des factures: " + facturesDir, e);
            }

            // récupération infos patient
            Patient p = f.getPatient(); // ⚠️ vérifie que ta classe Facture a bien un lien vers Patient
            String nom = safeFilename(p.getNom());
            String prenom = safeFilename(p.getPrenom());
            String cin = safeFilename(p.getCin());

            // date au format YYYY-MM-DD
            String dateStr = java.time.LocalDate.now().toString();

            // identifiant unique de facture
            String num = (f.getNumero() != null && !f.getNumero().isBlank())
                    ? f.getNumero()
                    : String.valueOf(f.getId());

            // nom de fichier final
            String filename = String.format("facture-%s_%s_%s_%s_%s.pdf",
                    nom, prenom, cin, dateStr, num);

            //Path target = facturesDir.resolve("facture-" + safeFilename(num) + ".pdf");
            Path target = facturesDir.resolve(filename);

            try (FileOutputStream fos = new FileOutputStream(target.toFile())) {
                fos.write(pdf);
            } catch (IOException e) {
                throw new RuntimeException("Impossible d'écrire le PDF: " + target, e);
            }

            return target.toString();
        }*/

        public Path renderToFileDirect(Facture f, List<FactureLigne> lignes) throws IOException {
            Path facturesDir = Paths.get(uploadDir).resolve("factures");
            Files.createDirectories(facturesDir);

            String filename = "facture-" + f.getId() + ".pdf";
            Path target = facturesDir.resolve(filename);

            try (OutputStream out = Files.newOutputStream(target)) {
                PdfRendererBuilder builder = new PdfRendererBuilder();
                Context ctx = new Context(Locale.FRENCH);
                ctx.setVariable("facture", f);
                ctx.setVariable("lignes", lignes);
                String html = templateEngine.process("facture-template", ctx);

                builder.useFastMode();
                builder.withHtmlContent(html, facturesDir.toUri().toString());
                builder.toStream(out);
                builder.run();
            } catch (Exception e) {
                throw new RuntimeException("Erreur génération PDF", e);
            }

            return target;
        }



        // -------- Helpers --------

        private String buildLogoSrcFromDbValue(String dbValue, Path uploadRoot) {
            try {
                if (dbValue == null || dbValue.isBlank()) return "";

                String v = dbValue.trim();

                // URL absolue web
                if (v.startsWith("http://") || v.startsWith("https://")) {
                    return v;
                }

                // Chemin "web" → enlever éventuel slash de tête
                String rel = v.startsWith("/") ? v.substring(1) : v; // "files/medecins/...png" ou "medecins/...png"

                // Si commence par "files/", enlève-le car uploadRoot POINTE déjà sur /uploads
                String relToUpload = rel.replaceFirst("^files[/\\\\]", ""); // "medecins/.../img.png"

                Path logoPath = uploadRoot.resolve(relToUpload).normalize();

                // Sécurité : empêcher l’escape vers l’extérieur
                if (!logoPath.startsWith(uploadRoot)) return "";

                if (!Files.exists(logoPath)) return "";

                // file:/.../%20...
                return logoPath.toUri().toString();
            } catch (Exception e) {
                return "";
            }
        }

        private String safeFilename(String input) {
            return input.replaceAll("[^A-Za-z0-9._-]", "_");
        }
    }






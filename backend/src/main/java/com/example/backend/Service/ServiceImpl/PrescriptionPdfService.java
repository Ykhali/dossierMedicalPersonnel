package com.example.backend.Service.ServiceImpl;

import com.example.backend.Entity.Patient;
import com.example.backend.Entity.Prescription;
import com.example.backend.Entity.PrescriptionLigne;
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;

@Service
public class PrescriptionPdfService {
    private final TemplateEngine templateEngine;

    @Value("${app.upload.dir}")
    private String uploadDir;

    public PrescriptionPdfService(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    /*public byte[] renderToBytes(Prescription p, List<PrescriptionLigne> lignes){
        Path uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();

        Context ctx = new Context(Locale.FRENCH);
        ctx.setVariable("prescription", p);
        ctx.setVariable("lignes", (lignes != null ? lignes : List.of()));


        String html = templateEngine.process("prescription-template", ctx);
        html = html.replace("&nbsp;", "&#160;");  // ou remplacer par "\u00A0"
        builder.withHtmlContent(html, baseUrl);

        String baseUri = uploadRoot.toUri().toString();

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
    }*/

    /*public byte[] renderToBytes(Prescription p, List<PrescriptionLigne> lignes) {
        Path uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();

        Context ctx = new Context(Locale.FRENCH);
        ctx.setVariable("prescription", p);
        ctx.setVariable("lignes", (lignes != null ? lignes : List.of()));

        // (Optionnel mais recommandé) Passer des src déjà résolus au template
        String logoSrc = (p.getMedecin() != null)
                ? buildLogoSrcFromDbValue(p.getMedecin().getLogoUrl(), uploadRoot)
                : "";
        String signatureSrc = (p.getMedecin() != null)
                ? buildLogoSrcFromDbValue(p.getMedecin().getSignatureUrl(), uploadRoot)
                : "";
        ctx.setVariable("medecinLogoSrc", logoSrc);
        ctx.setVariable("medecinSignatureSrc", signatureSrc);

        String html = templateEngine.process("prescription-template", ctx);

        // Fix OpenHTMLtoPDF : &nbsp; n'est pas une entité XML → remplacer par &#160;
        html = html.replace("&nbsp;", "&#160;");

        String baseUri = uploadRoot.toUri().toString(); // ex. file:/.../uploads/

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

    public byte[] renderToBytes(Prescription p, List<PrescriptionLigne> lignes) {
        Path uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();

        String logoSrc = buildLogoSrcFromDbValue(
                p.getMedecin() != null ? p.getMedecin().getLogoUrl() : null, uploadRoot);
        //String signatureSrc = buildLogoSrcFromDbValue(
        //        p.getMedecin() != null ? p.getMedecin().getSignatureUrl() : null, uploadRoot);

        Context ctx = new Context(Locale.FRENCH);
        ctx.setVariable("prescription", p);
        ctx.setVariable("lignes", (lignes != null ? lignes : List.of()));
        ctx.setVariable("logoSrc", logoSrc);
        //ctx.setVariable("signatureSrc", signatureSrc);

        String html = templateEngine.process("prescription-template", ctx)
                .replace("&nbsp;", "&#160;");

        String baseUri = uploadRoot.toUri().toString(); // ex: file:/.../uploads/

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
    }



    public String renderToFile(Prescription p, List<PrescriptionLigne> lignes){
        byte[] pdf = renderToBytes(p, lignes);

        Path prescriptionDir = Paths.get(uploadDir).resolve("ordonnances").toAbsolutePath().normalize();

        try{
            // crée le dossier (et ses parents) s’il n’existe pas
            Files.createDirectories(prescriptionDir);
        } catch (IOException e){
            throw new IllegalStateException("Impossible de créer le dossier des ordonnances: " + prescriptionDir, e);
        }

        // récupération infos patient
        Patient patient = p.getPatient();
        String nom = safeFilename(patient.getNom());
        String prenom = safeFilename(patient.getPrenom());
        String cin = safeFilename(patient.getCin());

        String dateStr = java.time.LocalDate.now().toString();

        String num = (p.getNumeroOrdonnance() != null && !p.getNumeroOrdonnance().isBlank())
                ? p.getNumeroOrdonnance()
                : String.valueOf(p.getId());

        //nom du fichier
        String filename = String.format("Ordonnance-%s_%s_%s_%s_%s.pdf",
                nom, prenom, cin, dateStr, num);

        Path target = prescriptionDir.resolve(filename);
        try (FileOutputStream fos = new FileOutputStream(target.toFile())) {
            fos.write(pdf);
        } catch (IOException e) {
            throw new RuntimeException("Impossible d'écrire le PDF: " + target, e);
        }

        return target.toString();
    }

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

    /*private String safeFilename(String input) {
        return input.replaceAll("[^A-Za-z0-9._-]", "_");
    }*/
    private String safeFilename(String input) {
        return (input == null || input.isBlank())
                ? "NA"
                : input.replaceAll("[^A-Za-z0-9._-]", "_");
    }

}

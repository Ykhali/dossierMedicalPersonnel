package com.example.backend.Entity;

import com.example.backend.Entity.Enums.Role;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "medecins")
public class Medecin extends User{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String adresse;
    @Column(nullable = true)
    private String ville;

    @Column(nullable = true)
    private String specialite;

    @Column(nullable = true)
    private String sousSpecialites;
    @Column(nullable = true)
    private String langues;
    @Column(nullable = true)
    private String bio;

    private Double prixConsult=0.0;

    private Double prixTeleconsult=0.0;


    @Column(nullable = true)
    private Boolean acceptTeleconsult;

    //private String imageUrl;
    @Column(nullable = true)
    private String logoUrl;
    @Column(nullable = true)
    private String signatureUrl;
    @Column(nullable = true)
    private String factureTemplatePath;

    private String sexe;

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<MedecinWeeklyHour> weeklyHours = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "medecin_receptionniste",
            joinColumns = @JoinColumn(name = "medecin_id"),
            inverseJoinColumns = @JoinColumn(name = "receptionniste_id")
    )
    @JsonIgnoreProperties({"medecins"}) // évite la récursion JSON
    private Set<Receptionniste> receptionnistes = new HashSet<>();

    //Constructors

    public Medecin() {
    }

    public Medecin(Long id,String CIN, String nom, String prenom, String email, String motDePasse, String telephone, String specialite, String sexe) {
        super(id,CIN, nom, prenom, email, motDePasse, telephone);
        this.specialite = specialite;
        this.sexe = sexe;
        this.id = id;
        super.setRole(Role.MEDECIN);
    }


    //Getters
    public String getSpecialite() {
        return specialite;
    }

    public String getSexe() {
        return sexe;
    }

    public String getAdresse() {
        return adresse;
    }

    public String getVille() {
        return ville;
    }

    public String getSousSpecialites() {
        return sousSpecialites;
    }

    public String getLangues() {
        return langues;
    }

    public String getBio() {
        return bio;
    }

    public Double getPrixConsult() {
        return prixConsult;
    }

    public Double getPrixTeleconsult() {
        return prixTeleconsult;
    }

    public Boolean getAcceptTeleconsult() {
        return acceptTeleconsult;
    }

    public Set<Receptionniste> getReceptionnistes() {
        return receptionnistes;
    }

    public void setReceptionnistes(Set<Receptionniste> receptionnistes) {
        this.receptionnistes = receptionnistes;
    }
    /*public String getImageUrl() {
        return imageUrl;
    }*/

    public String getLogoUrl() {
        return logoUrl;
    }

    public String getSignatureUrl() {
        return signatureUrl;
    }

    @Override
    public Long getId() {
        return id;
    }

    public Set<MedecinWeeklyHour> getWeeklyHours() {
        return weeklyHours;
    }

    //Setters
    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public void setVille(String ville) {
        this.ville = ville;
    }

    public void setSousSpecialites(String sousSpecialites) {
        this.sousSpecialites = sousSpecialites;
    }


    public void setLangues(String langues) {
        this.langues = langues;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public void setPrixConsult(Double prixConsult) {
        this.prixConsult = prixConsult;
    }

    public void setPrixTeleconsult(Double prixTeleconsult) {
        this.prixTeleconsult = prixTeleconsult;
    }

    public void setAcceptTeleconsult(Boolean acceptTeleconsult) {
        this.acceptTeleconsult = acceptTeleconsult;
    }

    /*public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }*/

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public void setSignatureUrl(String signatureUrl) {
        this.signatureUrl = signatureUrl;
    }

    @Override
    public void setId(Long id) {
        this.id = id;
    }

    public void setWeeklyHours(Set<MedecinWeeklyHour> weeklyHours) {
        this.weeklyHours = weeklyHours;
    }

    //helpers
    public void addWeeklyHour(MedecinWeeklyHour h) { h.setMedecin(this); weeklyHours.add(h); }
    public void removeWeeklyHour(MedecinWeeklyHour h) { weeklyHours.remove(h); h.setMedecin(null); }
}

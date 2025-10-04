package com.example.backend.Dto;

public class UpdateSigneVitalRequest {
    private Double temperature;
    private String tension;
    private Integer frequenceRespiratoire;
    private Double saturationOxygene;
    private Double poids;
    private Double taille;
    private String commentaire;

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getTension() {
        return tension;
    }

    public void setTension(String tension) {
        this.tension = tension;
    }

    public Integer getFrequenceRespiratoire() {
        return frequenceRespiratoire;
    }

    public void setFrequenceRespiratoire(Integer frequenceRespiratoire) {
        this.frequenceRespiratoire = frequenceRespiratoire;
    }

    public Double getSaturationOxygene() {
        return saturationOxygene;
    }

    public void setSaturationOxygene(Double saturationOxygene) {
        this.saturationOxygene = saturationOxygene;
    }

    public Double getPoids() {
        return poids;
    }

    public void setPoids(Double poids) {
        this.poids = poids;
    }

    public Double getTaille() {
        return taille;
    }

    public void setTaille(Double taille) {
        this.taille = taille;
    }

    public String getCommentaire() {
        return commentaire;
    }

    public void setCommentaire(String commentaire) {
        this.commentaire = commentaire;
    }
}

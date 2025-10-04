package com.example.backend.Dto;

public class FactureResponse {
    public Long id;
    public String numero;
    public String patientNom;
    public String statut;
    public java.math.BigDecimal totalHT, totalTVA, totalTTC;

    public FactureResponse(Long id, String numero, String patientNom, String statut,
                           java.math.BigDecimal totalHT, java.math.BigDecimal totalTVA, java.math.BigDecimal totalTTC) {
        this.id=id; this.numero=numero; this.patientNom=patientNom; this.statut=statut;
        this.totalHT=totalHT; this.totalTVA=totalTVA; this.totalTTC=totalTTC;
    }
}

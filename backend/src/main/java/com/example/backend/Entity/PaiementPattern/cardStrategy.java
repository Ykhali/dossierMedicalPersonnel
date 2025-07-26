package com.example.backend.Entity.PaiementPattern;

public class cardStrategy implements IPaiement {
    private String numCarte;

    public cardStrategy(String numCarte) {
        this.numCarte = numCarte;
    }


    @Override
    public void pay(double amount) {
        System.out.println("Payement de " + amount + "MAD effectué par carte bancaire.");
    }
}

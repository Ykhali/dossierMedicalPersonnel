package com.example.backend.config;

public final class FactureNumbering {
    private FactureNumbering(){}
    public static String nextNumero(long seedId) {
        var today = java.time.LocalDate.now();
        return String.format("FAC-%d%02d%02d-%06d",
                today.getYear(), today.getMonthValue(), today.getDayOfMonth(), seedId % 1_000_000);
    }
}


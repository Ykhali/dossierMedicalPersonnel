package com.example.backend.config;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public final class NumberingUtils {
    private NumberingUtils() {}
    public static String nextNumero(long seq) {
        String today = LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE); // YYYYMMDD
        return "FACT-" + today + "-" + String.format("%04d", seq % 10000);
    }
}


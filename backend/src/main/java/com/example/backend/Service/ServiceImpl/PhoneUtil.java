package com.example.backend.Service.ServiceImpl;

import com.google.i18n.phonenumbers.PhoneNumberUtil;
import com.google.i18n.phonenumbers.NumberParseException;

public final class PhoneUtil {
    private static final PhoneNumberUtil P = PhoneNumberUtil.getInstance();

    public PhoneUtil() {
    }

    public static String toE164(String raw, String defaultRegion) {
        try {
            var num = P.parse(raw, defaultRegion); // "MA" pour Maroc
            if (!P.isValidNumber(num)) throw new IllegalArgumentException("Numéro invalide");
            return P.format(num, PhoneNumberUtil.PhoneNumberFormat.E164);
        } catch (NumberParseException e) {
            throw new IllegalArgumentException("Numéro invalide");
        }
    }
}


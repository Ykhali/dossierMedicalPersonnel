package com.example.backend.Service.ServiceImpl;

import com.twilio.rest.verify.v2.service.Verification;
import com.twilio.rest.verify.v2.service.VerificationCheck;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class PhoneVerifyService {
    @Value("${twilio.verifyServiceSid}") String verifySid;

    public void sendCodeSms(String e164Phone) {
        com.twilio.rest.verify.v2.service.Verification.creator(verifySid, e164Phone, "sms").create();
    }
    public boolean checkCode(String e164Phone, String code) {
        var res = com.twilio.rest.verify.v2.service.VerificationCheck.creator(verifySid)
                .setTo(e164Phone).setCode(code).create();
        return "approved".equalsIgnoreCase(res.getStatus());
    }
}


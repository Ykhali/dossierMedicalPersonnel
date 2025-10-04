package com.example.backend.config;

import com.twilio.Twilio;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TwilioInitializer {
    @Value("${twilio.accountSid}")
    String sid;
    @Value("${twilio.authToken}")
    String token;

    @PostConstruct
    public void init() {
        Twilio.init(sid, token);
    }
}

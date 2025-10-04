package com.example.backend.config;

import com.example.backend.events.UserReactivatedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class RealtimeNotificationListener {

    private final SimpMessagingTemplate messagingTemplate;

    public RealtimeNotificationListener(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void onUserReactivated(UserReactivatedEvent evt) {
        var payload = Map.of(
                "type", "ACCOUNT_REACTIVATED",
                "userId", evt.getUserId(),
                "message", "Votre compte a été réactivé."
        );
        // user-specific topic, e.g. /topic/users/{id}
        messagingTemplate.convertAndSend("/topic/users/" + evt.getUserId(), payload);
    }
}

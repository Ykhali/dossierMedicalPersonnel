// useUserNotifications.js
import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default function useUserNotifications(userId, onMessage) {
  const clientRef = useRef(null);

  useEffect(() => {
    if (!userId) return;
    const socketFactory = () => new SockJS("/ws");
    const client = new Client({
      webSocketFactory: socketFactory,
      reconnectDelay: 3000,
      onConnect: () => {
        client.subscribe(`/topic/users/${userId}`, (frame) => {
          const payload = JSON.parse(frame.body || "{}");
          onMessage?.(payload);
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => client.deactivate();
  }, [userId, onMessage]);
}

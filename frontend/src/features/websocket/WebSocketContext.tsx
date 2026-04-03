import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import type { WsEvent } from "./ws";

interface WebSocketContextType {
    subscribeToTopic: (topic: string, callback: (event: any) => void) => () => void;
    isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const stompRef = useRef<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const dispatch = useCallback((event: WsEvent) => {
        handlers.current.forEach((h) => h(event));
    }, []);

    useEffect(() => {
        const client = new Client({
            brokerURL: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`,

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            debug: (str) => console.debug("[STOMP]", str),

            onConnect: () => {
                console.debug("[WS] Connected");
                setIsConnected(true);
            },

            onDisconnect: () => {
                console.debug("[WS] Disconnected");
                setIsConnected(false);
            },

            onStompError: (frame) => {
                console.error("[WS] STOMP error", frame.headers["message"], frame.body);
            },
        });

        client.activate();
        stompRef.current = client;

        return () => {
            client.deactivate();
            stompRef.current = null;
        };
    }, []);

    const subscribeToTopic = useCallback((topic: string, callback: (event: WsEvent) => void) => {
        if (!stompRef.current || !stompRef.current.connected) {
            return () => { };
        }

        const subscription = stompRef.current.subscribe(topic, (message) => {
            try {
                const event: WsEvent = JSON.parse(message.body);
                callback(event);
            } catch (e) {
                console.error(`[WS] Error parsing message from ${topic}`, e);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);


    return (
        <WebSocketContext.Provider value={{ subscribeToTopic, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error('useWebSocket must be used within a WebSocketProvider');
    return ctx;
}
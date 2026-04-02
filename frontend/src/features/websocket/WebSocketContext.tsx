import React, { createContext, useContext, useCallback, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import type { WsEvent } from "./ws";

interface WebSocketContextType {
    subscribe: (handler: (event: WsEvent) => void) => () => void;
    isConnected: () => boolean;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
    const stompRef = useRef<Client | null>(null);
    const handlers = useRef<Set<(event: WsEvent) => void>>(new Set());

    const dispatch = useCallback((event: WsEvent) => {
        handlers.current.forEach((h) => h(event));
    }, []);

    useEffect(() => {
        const client = new Client({
            brokerURL: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws`,

            reconnectDelay: 5000,

            debug: (str) => console.debug("[STOMP]", str),

            onConnect: () => {
                console.debug("Connected to WebSocket");
                client.subscribe("/user/queue/events", (message) => {
                    try {
                        const event: WsEvent = JSON.parse(message.body);
                        console.debug("[WS] received:", event);
                        dispatch(event);
                    } catch {
                        console.warn("[WS] failed to parse message", message.body);
                    }
                });
            },

            onDisconnect: () => console.log("[WS] disconnected"),

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

    const subscribe = useCallback((handler: (event: WsEvent) => void) => {
        handlers.current.add(handler);
        return () => handlers.current.delete(handler);
    }, []);

    const isConnected = useCallback(() => {
        return stompRef.current?.connected ?? false;
    }, []);

    return (
        <WebSocketContext.Provider value={{ subscribe, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const ctx = useContext(WebSocketContext);
    if (!ctx) throw new Error('useWebSocket must be used within a WebSocketProvider');
    return ctx;
}
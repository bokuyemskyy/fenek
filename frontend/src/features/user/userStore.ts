import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { User } from './user';
import type { PresenceEvent } from '@features/websocket/ws';
import { useEffect } from 'react';

interface UserState {
    registry: Record<string, User>;
    pendingIds: Set<string>;
    batchTimeout: ReturnType<typeof setTimeout> | null;

    requestUsers: (userIds: string[]) => void;
    onPresenceUpdate: (event: PresenceEvent) => void;
    _processQueue: () => Promise<void>;
}

const CACHE_TTL_MS = 10 * 60 * 1000;
const BATCH_DELAY_MS = 50;

export const useUserStore = create<UserState>()(
    immer((set, get) => ({
        registry: {},
        pendingIds: new Set(),
        batchTimeout: null,

        requestUsers: (userIds) => {
            const { registry, pendingIds, batchTimeout } = get();
            const now = Date.now();
            let addedNew = false;

            userIds.forEach((id) => {
                if (!id) return;
                const cached = registry[id];
                const isExpired = !cached || !cached.fetchedAt || (now - cached.fetchedAt > CACHE_TTL_MS);

                if (isExpired && !pendingIds.has(id)) {
                    set((s) => { s.pendingIds.add(id); });
                    addedNew = true;
                }
            });

            if (addedNew && !batchTimeout) {
                const timeout = setTimeout(() => get()._processQueue(), BATCH_DELAY_MS);
                set((s) => { s.batchTimeout = timeout; });
            }
        },

        _processQueue: async () => {
            const idsToFetch = Array.from(get().pendingIds);

            set((s) => {
                s.pendingIds.clear();
                s.batchTimeout = null;
            });

            if (idsToFetch.length === 0) return;

            try {
                const res = await fetch('/api/users/batch', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userIds: idsToFetch }),
                });

                if (!res.ok) return;
                const data = await res.json();
                const fetchedUsers: User[] = data.users || [];

                set((s) => {
                    const now = Date.now();
                    fetchedUsers.forEach((u) => {
                        s.registry[u.id] = { ...u, fetchedAt: now };
                    });

                    idsToFetch.forEach(id => {
                        if (!s.registry[id]) {
                            s.registry[id] = { id, username: 'unknown', fetchedAt: now } as User;
                        }
                    });
                });
            } catch (err) {
                console.error("Failed to batch fetch users", err);
            }
        },

        onPresenceUpdate: (event) => set((s) => {
            if (s.registry[event.userId]) {
                s.registry[event.userId].online = event.online;
                s.registry[event.userId].lastSeenAt = event.lastSeen;
            }
        }),
    }))
);

export const useUser = (userId?: string) => {
    const user = useUserStore((s) => userId ? s.registry[userId] : undefined);
    const requestUsers = useUserStore((s) => s.requestUsers);

    useEffect(() => {
        if (userId) requestUsers([userId]);
    }, [userId, requestUsers]);

    return user;
};
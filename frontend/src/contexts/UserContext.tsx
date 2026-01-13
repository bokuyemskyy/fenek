import React, {
    useEffect,
    createContext,
    useContext,
    useState,
    useRef,
    useCallback,
} from 'react';
import type { User, BatchUserRequest } from '../types/user';

interface UserContextValue {
    registry: Record<string, User>;
    requestUsers: (userIds: string[]) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const BATCH_DELAY_MS = 30;
const STORAGE_KEY = 'user-registry';

const loadStaleRegistry = (): Record<string, User> => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [registry, setRegistry] = useState<Record<string, User>>(() => loadStaleRegistry());

    const registryRef = useRef(registry);

    useEffect(() => {
        registryRef.current = registry;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
    }, [registry]);

    const pendingIdsRef = useRef<Set<string>>(new Set());
    const batchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const processQueue = async () => {
        const idsToFetch = Array.from(pendingIdsRef.current);
        pendingIdsRef.current.clear();
        batchTimeoutRef.current = null;

        if (idsToFetch.length === 0) return;

        try {
            const response = await fetch('/api/users/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds: idsToFetch } as BatchUserRequest),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            const newUsers: User[] = data.users || [];

            setRegistry(prev => {
                const next = { ...prev };
                const now = Date.now();

                newUsers.forEach(u => {
                    next[u.id] = { ...u, fetchedAt: now };
                });

                idsToFetch.forEach(id => {
                    if (!next[id]) {
                        next[id] = {
                            id,
                            username: 'unknown',
                            displayName: 'Unknown User',
                            fetchedAt: now,
                        } as User;
                    }
                });
                return next;
            });
        } catch (e) {
            console.error('Batch fetch failed', e);
        }
    };

    const requestUsers = useCallback((userIds: string[]) => {
        const now = Date.now();
        let hasNewRequest = false;

        userIds.forEach(id => {
            if (!id) return;
            const cached = registryRef.current[id];

            const isExpired = !cached || !cached.fetchedAt || (now - cached.fetchedAt > CACHE_TTL_MS);

            if (isExpired && !pendingIdsRef.current.has(id)) {
                pendingIdsRef.current.add(id);
                hasNewRequest = true;
            }
        });

        if (hasNewRequest && !batchTimeoutRef.current) {
            batchTimeoutRef.current = setTimeout(processQueue, BATCH_DELAY_MS);
        }
    }, []);

    return (
        <UserContext.Provider value={{ registry, requestUsers }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUsers = () => {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error("useUserRegistry must be used within UserProvider");
    return ctx;
};

export const useUser = (userId?: string): User | undefined => {
    const { registry, requestUsers } = useUsers();

    useEffect(() => {
        if (userId) requestUsers([userId]);
    }, [userId, requestUsers]);

    return userId ? registry[userId] : undefined;
};
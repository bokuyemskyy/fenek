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
    requestUser: (userId: string | undefined, force?: boolean) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 mins
const BATCH_DELAY_MS = 20;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [registry, setRegistry] = useState<Record<string, User>>({});

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
                headers: { "Content-Type": "application/json" },
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
                            username: "unknown",
                            displayName: 'Unknown User',
                            color: "#808080",
                            avatarUrl: undefined,
                            fetchedAt: now,
                        };
                    }
                });

                return next;
            });
        } catch (e) {
            console.error('Failed to fetch users batch', e);
        }
    };

    const requestUser = useCallback((userId?: string, force = false) => {
        if (!userId) return;

        setRegistry(prev => {
            const cachedUser = prev[userId];
            const now = Date.now();

            const isMissing = !cachedUser;
            const isExpired = cachedUser?.fetchedAt && (now - cachedUser.fetchedAt > CACHE_TTL_MS);

            if (force || isMissing || isExpired) {
                pendingIdsRef.current.add(userId);

                if (!batchTimeoutRef.current) {
                    batchTimeoutRef.current = setTimeout(processQueue, BATCH_DELAY_MS);
                }
            }

            return prev;
        });
    }, []);

    return (
        <UserContext.Provider value={{ registry, requestUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (userId?: string, force = false): User | undefined => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }

    const { registry, requestUser } = context;
    const user = userId ? registry[userId] : undefined;

    useEffect(() => {
        if (userId) {
            requestUser(userId, force);
        }
    }, [userId, force, requestUser]);

    return user;
};
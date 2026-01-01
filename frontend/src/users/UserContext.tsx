import {
    useEffect,
    createContext,
    useContext,
    useState,
    useRef,
    useCallback,
} from 'react';

const UserContext = createContext(null);

const CACHE_TTL_MS = 10 * 60 * 1000;
const BATCH_DELAY_MS = 50;

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [registry, setRegistry] = useState({});

    const pendingIdsRef = useRef(new Set());
    const batchTimeoutRef = useRef(null);

    const processQueue = async () => {
        const idsToFetch = Array.from(pendingIdsRef.current);
        pendingIdsRef.current.clear();
        batchTimeoutRef.current = null;

        if (idsToFetch.length === 0) return;

        try {
            const response = await fetch('/api/users/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: idsToFetch }),
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const newUsers = await response.json();

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
                            name: 'Unknown User',
                            avatar: null,
                            fetchedAt: now,
                        };
                    }
                });

                return next;
            });
        } catch (e) {
            console.error('Failed to fetch users', e);
        }
    };

    const requestUser = useCallback((userId, force = false) => {
        if (!userId) return;

        setRegistry(prev => {
            const cachedUser = prev[userId];
            const now = Date.now();

            const isMissing = !cachedUser;
            const isExpired =
                cachedUser && now - cachedUser.fetchedAt > CACHE_TTL_MS;

            if (force || isMissing || isExpired) {
                pendingIdsRef.current.add(userId);

                if (!batchTimeoutRef.current) {
                    batchTimeoutRef.current = setTimeout(
                        processQueue,
                        BATCH_DELAY_MS
                    );
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

export const useUser = (userId, force = false) => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserRegistryProvider');
    }

    const { registry, requestUser } = context;
    const user = registry[userId];

    useEffect(() => {
        if (userId) {
            requestUser(userId, force);
        }
    }, [userId, force, requestUser]);

    return user;
};
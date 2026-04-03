export interface User {
    id: string;
    username: string;
    displayName: string;
    color?: string;
    avatarUrl?: string;

    online: boolean;
    lastSeenAt: string;

    fetchedAt?: number;
}

export interface BatchUserRequest {
    userIds: string[];
}
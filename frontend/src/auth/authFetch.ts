import keycloak from "../keycloak";

export async function authFetch(url: string, options: RequestInit = {}) {
    if (!keycloak.authenticated) throw new Error("Not authenticated");
    await keycloak.updateToken(5);
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${keycloak.token}`
        }
    });
}
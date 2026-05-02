const AUTH_KEYS = ["access", "refresh", "user"];

function getStoredValue(key) {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
}

function decodeJwtPayload(token) {
    try {
        const payload = token.split(".")[1];
        const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(normalized));
    } catch {
        return null;
    }
}

export function getAuthToken() {
    return getStoredValue("access");
}

export function clearAuth() {
    AUTH_KEYS.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
}

export function saveAuth({ access, refresh, user }, remember = false) {
    clearAuth();

    const storage = remember ? localStorage : sessionStorage;
    storage.setItem("access", access);
    storage.setItem("refresh", refresh);
    storage.setItem("user", JSON.stringify(user));
}

export function getCurrentUser() {
    try {
        return JSON.parse(getStoredValue("user") || "{}");
    } catch {
        return {};
    }
}

export function hasValidAuthSession() {
    const token = getAuthToken();
    const user = getCurrentUser();

    if (!token || !user?.id) {
        return false;
    }

    const payload = decodeJwtPayload(token);
    if (!payload?.exp) {
        return false;
    }

    return payload.exp * 1000 > Date.now();
}

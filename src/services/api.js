import axios from "axios";
import { clearAuth, getAuthToken, hasValidAuthSession } from "./auth";

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/",
});

function isPublicRequest(config) {
    const url = config.url || "";
    const method = (config.method || "get").toLowerCase();

    return (
        url.startsWith("users/countrycode/") ||
        url.startsWith("users/login/") ||
        (url.startsWith("users/users/") && method === "post")
    );
}

API.interceptors.request.use((config) => {
    if (isPublicRequest(config)) {
        delete config.headers.Authorization;
        return config;
    }

    if (!hasValidAuthSession()) {
        clearAuth();
        return config;
    }

    const token = getAuthToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;

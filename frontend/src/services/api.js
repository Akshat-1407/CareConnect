const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

let isRefreshing = false;
let refreshSubscribers = [];

function onTokenRefreshed() {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
}

/**
 * Base fetch client configured with HttpOnly cookie support and JSON handling.
 * Handles 401 → auto-refresh → retry once.
 */
export async function apiClient(endpoint, options = {}, _isRetry = false) {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", // Ensures HttpOnly cookies are sent automatically
  };

  const response = await fetch(url, config);

  // If unauthorised and this is not already a retry, attempt token refresh
  if (response.status === 401 && !_isRetry) {
    const refreshEndpoint = `${API_BASE_URL}/auth/token/refresh/`;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshRes = await fetch(refreshEndpoint, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (refreshRes.ok) {
          isRefreshing = false;
          onTokenRefreshed();
          // Retry original request once
          return apiClient(endpoint, options, true);
        } else {
          // Refresh failed
          isRefreshing = false;
          throw { status: 401, data: { detail: "Session expired. Please log in again." } };
        }
      } catch {
        isRefreshing = false;
        throw { status: 401, data: { detail: "Session expired." } };
      }
    } else {
      // Another refresh is already in-flight — queue this request
      await new Promise((resolve) => refreshSubscribers.push(resolve));
      return apiClient(endpoint, options, true);
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw { status: response.status, data: data || { detail: "An unexpected error occurred." } };
  }

  return data;
}

/** Check backend health status */
export async function checkBackendHealth() {
  const url = `${API_BASE_URL}/health/`;
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("Backend offline");
  return res.json();
}

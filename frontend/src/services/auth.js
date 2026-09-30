import { apiClient } from "./api";

/** Patient registration */
export async function registerPatient(data) {
  return apiClient("/auth/register/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/** Patient login */
export async function loginPatient(credentials) {
  return apiClient("/auth/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/** Doctor login */
export async function loginDoctor(credentials) {
  return apiClient("/auth/doctor/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/** Admin login */
export async function loginAdmin(credentials) {
  return apiClient("/internal/admin/auth/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

/** Logout (all roles) */
export async function logout() {
  return apiClient("/auth/logout/", { method: "POST" });
}

/** Get currently authenticated user */
export async function getMe() {
  return apiClient("/auth/me/");
}

/** Refresh access token using refresh cookie */
export async function refreshToken() {
  return apiClient("/auth/token/refresh/", { method: "POST" });
}

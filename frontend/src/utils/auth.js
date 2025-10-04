// src/utils/auth.js
import { jwtDecode } from "jwt-decode";

export function getToken() {
  return (
    localStorage.getItem("token") || sessionStorage.getItem("token") || null
  );
}

export function isTokenValid(token) {
  try {
    const { exp } = jwtDecode(token || "");
    if (!exp) return false;
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getSafeUserFromToken(token) {
  try {
    const decoded = jwtDecode(token || "");
    return {
      role: decoded?.role ?? null,
      prenom: decoded?.prenom ?? "",
      nom: decoded?.nom ?? "",
    };
  } catch {
    return { role: null, prenom: "", nom: "" };
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    localStorage.clear();
    sessionStorage.clear();

    // Efface d’éventuels cookies non httpOnly.
    document.cookie = "token=; Max-Age=0; path=/;";
    document.cookie = "refreshToken=; Max-Age=0; path=/;";
  } catch {}
}

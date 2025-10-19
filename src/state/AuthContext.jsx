import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // ---- Load from localStorage safely ----
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("hp:user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("hp:token"));

  // ---- Keep user/token synced with localStorage ----
  useEffect(() => {
    if (user) localStorage.setItem("hp:user", JSON.stringify(user));
    else localStorage.removeItem("hp:user");
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("hp:token", token);
    else localStorage.removeItem("hp:token");
  }, [token]);

  // ---- Attach token to axios requests ----
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => api.interceptors.request.eject(interceptor);
  }, [token]);

  // ---- Logout ----
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("hp:user");
    localStorage.removeItem("hp:token");
  };

  // ---- Context Value ----
  const value = useMemo(
    () => ({
      user,
      setUser,
      token,
      setToken,
      logout,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

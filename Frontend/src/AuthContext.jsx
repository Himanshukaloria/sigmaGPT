import { useState, useEffect } from "react";
import { AuthContext } from "./auth-context.js";
import API_URL from "./api.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [guest, setGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const restoreAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!cancelled) setUser(res.ok ? data.user : null);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) {
          setTimeout(() => {
            if (!cancelled) setLoading(false);
          }, 800);
        }
      }
    };

    restoreAuth();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setUser(data.user);
    setGuest(false);
    return data.user;
  };

  const signup = async (name, email, password) => {
    const res = await fetch(`${API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    setUser(data.user);
    setGuest(false);
    return data.user;
  };

  const logout = async () => {
    await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setGuest(false);
  };

  const continueAsGuest = () => {
    setGuest(true);
  };

  return (
    <AuthContext.Provider
      value={{ user, guest, loading, login, signup, logout, continueAsGuest }}
    >
      {children}
    </AuthContext.Provider>
  );
};

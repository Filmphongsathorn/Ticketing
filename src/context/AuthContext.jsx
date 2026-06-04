/**
 * AuthContext.jsx
 * ---------------------------------------------------------------------------
 * Provides JWT token management and current-user state to the whole app.
 *
 * Stores the raw JWT in localStorage under 'jwt_token'.
 * The Axios interceptor in api.js reads from that same key automatically.
 * ---------------------------------------------------------------------------
 */

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../api/api';

const TOKEN_KEY = 'jwt_token';
const USER_KEY  = 'current_user';

export const AuthContext = createContext(null);

/** Decode a JWT payload (base-64 middle segment) without a library. */
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user,  setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  // Listen for 401 events fired by the Axios interceptor
  useEffect(() => {
    const handler = () => logout();
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const persistToken = useCallback((rawToken, userData) => {
    localStorage.setItem(TOKEN_KEY, rawToken);
    localStorage.setItem(USER_KEY,  JSON.stringify(userData));
    setToken(rawToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiLogin({ email, password });
      // API Gateway / Auth Service returns: { token: "...", userId: "...", email: "..." }
      const payload  = decodeJwtPayload(data.token);
      const userData = { id: data.userId ?? payload?.sub, email: data.email ?? email };
      persistToken(data.token, userData);
      return { success: true };
    } catch (err) {
      const msg = err.message ?? 'Login failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [persistToken]);

  const register = useCallback(async (email, password, displayName) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiRegister({ email, password, displayName });
      const payload  = decodeJwtPayload(data.token);
      const userData = { id: data.userId ?? payload?.sub, email: data.email ?? email, displayName };
      persistToken(data.token, userData);
      return { success: true };
    } catch (err) {
      const msg = err.message ?? 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  }, [persistToken]);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token),
    loading,
    error,
    login,
    logout,
    register,
    clearError: () => setError(null),
  }), [token, user, loading, error, login, logout, register]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

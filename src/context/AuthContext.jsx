import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { loginUser as loginAPI, registerUser as registerAPI, logoutUser as logoutAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = useMemo(() => !!token, [token]);

  const login = useCallback(async (phone, password) => {
    setLoading(true);
    try {
      const response = await loginAPI(phone, password);
      const data = response.data;
      const newToken = data.token || data.data?.token || data.access_token;
      const userData = data.user || data.data?.user || data.data;
      if (newToken) { localStorage.setItem('auth_token', newToken); setToken(newToken); }
      if (userData) { localStorage.setItem('user', JSON.stringify(userData)); setUser(userData); }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'فشل تسجيل الدخول' };
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const response = await registerAPI(formData);
      const data = response.data;
      const newToken = data.token || data.data?.token;
      const userData = data.user || data.data?.user || data.data;
      if (newToken) { localStorage.setItem('auth_token', newToken); setToken(newToken); }
      if (userData) { localStorage.setItem('user', JSON.stringify(userData)); setUser(userData); }
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'فشل التسجيل' };
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    try { await logoutAPI(); } catch { }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isAuthenticated, loading, login, register, logout }),
    [user, token, isAuthenticated, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

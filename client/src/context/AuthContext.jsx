import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('chilika_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch {
          logout();
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('chilika_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
  };

  const adminLogin = async (email, password) => {
    const res = await api.adminLogin({ email, password });
    if (res.success && res.token) {
      localStorage.setItem('chilika_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
  };

  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('chilika_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.logout();
      }
    } catch {
      // Ignored: always clear client state
    } finally {
      localStorage.removeItem('chilika_token');
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData) => {
    const res = await api.updateProfile(profileData);
    if (res.success && res.user) {
      setUser(res.user);
      return res;
    }
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        adminLogin,
        register,
        logout,
        updateProfile,
        isAdmin,
        isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

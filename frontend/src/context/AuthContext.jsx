import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user profile on initialization or token change
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await authAPI.getMe();
        setUser(res.data.user);
        setProfile(res.data.profile);
        setError(null);
      } catch (err) {
        console.error('Session validation failed:', err);
        // Session expired or bad token
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authAPI.login({ email, password });
      
      const { token: receivedToken, user: receivedUser, profile: receivedProfile } = res.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setProfile(receivedProfile);
      return { success: true, user: receivedUser };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const res = await authAPI.register(userData);
      
      const { token: receivedToken, user: receivedUser, profile: receivedProfile } = res.data;
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setUser(receivedUser);
      setProfile(receivedProfile);
      return { success: true, user: receivedUser };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Try again.';
      setError(errMsg);
      return { success: false, error: errMsg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const syncProfile = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  const value = {
    user,
    profile,
    token,
    loading,
    error,
    login,
    register,
    logout,
    syncProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

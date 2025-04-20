// src/context/AuthContext.jsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { setToken, getToken, getUser, removeToken, isAuthenticated, getUserRole } from '@/lib/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Initialize user from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated()) {
        setUser(getUser());
        
        try {
          // Verify token with API
          const response = await authAPI.getProfile();
          const userData = response.data.data;
          setUser(userData);
        } catch (err) {
          console.error('Failed to fetch user profile', err);
          // Token might be invalid - clear it
          removeToken();
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      setToken(token, user);
      setUser(user);
      
      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      
      setToken(token, user);
      setUser(user);
      
      return user;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    
    try {
      // Call logout API
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear token and user info regardless of API response
      removeToken();
      setUser(null);
      setLoading(false);
      router.push('/auth/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated: !!user,
        role: user?.role || null,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
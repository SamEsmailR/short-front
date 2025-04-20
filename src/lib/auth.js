// src/lib/auth.js
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'resume_shortlister_token';
const USER_KEY = 'resume_shortlister_user';

// Save token and user info to localStorage
export const setToken = (token, user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

// Get token from localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
};

// Get user from localStorage
export const getUser = () => {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
  }
  return null;
};

// Remove token and user info from localStorage
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < currentTime) {
      removeToken();
      return false;
    }
    
    return true;
  } catch (error) {
    removeToken();
    return false;
  }
};

// Get user role
export const getUserRole = () => {
  const user = getUser();
  return user ? user.role : null;
};
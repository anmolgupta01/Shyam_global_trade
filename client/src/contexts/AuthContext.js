import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';


const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Token validation utility
  const isTokenValid = useCallback((token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      // Check if token is expired
      if (decoded.exp < currentTime) {
        return false;
      }
      
      return decoded;
    } catch (error) {
      return false;
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          const decoded = isTokenValid(token);
          
          if (decoded) {
            setUser({
              id: decoded.userId,
              username: decoded.username,
              role: decoded.role
            });
            setIsAuthenticated(true);
          } else {
            // Invalid token, remove it
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isTokenValid]);

  // Enhanced login with API call
  const login = useCallback(async (username, password) => {
    try {
      setLoading(true);

      // For development/demo - environment variable check
      const adminUsername = process.env.REACT_APP_ADMIN_USERNAME;
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;

      if (username === adminUsername && password === adminPassword) {
        // Create demo token (in production, this comes from server)
        const tokenPayload = {
          userId: 'admin-001',
          username: username,
          role: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        };

        // Simulate JWT token (in production, server generates this)
        const token = btoa(JSON.stringify({
          header: { alg: 'HS256', typ: 'JWT' },
          payload: tokenPayload,
          signature: 'demo-signature'
        }));

        localStorage.setItem('token', token);
        
        setUser({
          id: tokenPayload.userId,
          username: tokenPayload.username,
          role: tokenPayload.role
        });
        setIsAuthenticated(true);

        return { success: true, user: { username, role: 'admin' } };
      } else {
        return {
          success: false,
          message: 'Invalid credentials. Please check your username and password.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  }, []);

  // Production login with API
  const loginWithAPI = useCallback(async (username, password) => {
    try {
      setLoading(true);

      const response = await api.post('/auth/login', {
        username,
        password
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('token', token);
        setUser(user);
        setIsAuthenticated(true);
        return { success: true, user };
      }

      return { success: false, message: 'Login failed' };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout with cleanup
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    
    // Optional: Call logout API to invalidate token on server
    // api.post('/auth/logout').catch(() => {});
  }, []);

  // Auto-logout on token expiration
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isAuthenticated) {
      const decoded = isTokenValid(token);
      if (decoded) {
        const timeUntilExpiry = (decoded.exp * 1000) - Date.now();
        
        // Auto logout 1 minute before expiry
        const logoutTimeout = setTimeout(() => {
          logout();
        }, Math.max(timeUntilExpiry - 60000, 0));

        return () => clearTimeout(logoutTimeout);
      }
    }
  }, [isAuthenticated, isTokenValid, logout]);

  // Role-based access helpers
  const hasRole = useCallback((role) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles) => {
    return roles.some(role => user?.role === role);
  }, [user]);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  // Get current user data
  const getCurrentUser = useCallback(() => {
    return user;
  }, [user]);

  // Check if user is authenticated
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token');
    return token && isTokenValid(token) && isAuthenticated;
  }, [isTokenValid, isAuthenticated]);

  const contextValue = {
    user,
    loading,
    isAuthenticated,
    login: process.env.NODE_ENV === 'production' ? loginWithAPI : login,
    logout,
    isAdmin,
    hasRole,
    hasAnyRole,
    getCurrentUser,
    checkAuth
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

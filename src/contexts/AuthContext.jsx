import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkAuthStatus, handleAuthCallback } from '../config/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await checkAuthStatus();
      setIsAuthenticated(authenticated);
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    if (code) {
      handleAuthCallback(code)
        .then(() => {
          setIsAuthenticated(true);
          window.history.pushState({}, '', '/');
        })
        .catch(console.error);
    }
  }, []);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
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
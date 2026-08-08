import React, { createContext, useContext, useState, useEffect } from "react";
import { storage } from "../utils/storage";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = storage.getToken();
    const storedUser = storage.getUser();
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    storage.setUser(userData);
    storage.setToken(jwtToken);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    storage.setUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    storage.clearAll();
  };

  const value = {
    user,
    token,
    role: user?.role || null,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    logout,
    updateUser, // <-- add this
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

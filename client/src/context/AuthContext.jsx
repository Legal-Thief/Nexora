

import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, getMe, updateProfile as updateProfileAPI } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);          
  const [token, setToken] = useState(null);         
  const [loading, setLoading] = useState(true);     

  
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      
      getMe()
        .then((res) => {
          setUser(res.data);
        })
        .catch(() => {
          
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  
  const register = async (name, email, password) => {
    const res = await registerUser(name, email, password);
    const { token: newToken, user: newUser } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);

    return res.data;
  };

  
  const login = async (email, password) => {
    const res = await loginUser(email, password);
    const { token: newToken, user: newUser } = res.data;

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);

    return res.data;
  };

  
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  
  const updateProfile = async (data) => {
    const res = await updateProfileAPI(data);
    setUser(res.data.user);
    return res.data;
  };

  
  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}

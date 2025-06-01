import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  isLogged: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isLogged: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const loadStorage = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLogged(!!token);
    };
    loadStorage();
  }, []);

  const login = async (token: string) => {
    await AsyncStorage.setItem('token', token);
    setIsLogged(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

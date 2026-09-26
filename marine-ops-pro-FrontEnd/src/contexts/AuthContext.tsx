import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockUsuarios, Usuario } from '@/data/mockData';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('usuario');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, senha: string): boolean => {
    const usuarioEncontrado = mockUsuarios.find(
      u => u.email === email && u.senha === senha
    );
    
    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado);
      localStorage.setItem('usuario', JSON.stringify(usuarioEncontrado));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  const isAuthenticated = !!usuario;

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
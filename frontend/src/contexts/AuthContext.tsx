import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, authStorage, mensagemErro } from '@/lib/api';
import type { Usuario } from '@/types';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<{ ok: boolean; erro?: string }>;
  logout: () => Promise<void>;
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
    // Sessão salva (token + usuário) no localStorage
    const savedUser = authStorage.getUsuario();
    return savedUser && authStorage.getToken() ? JSON.parse(savedUser) : null;
  });

  // Confirma na API que o token salvo ainda é válido
  useEffect(() => {
    if (!authStorage.getToken()) return;
    api.get<Usuario>('/me')
      .then(setUsuario)
      .catch(() => {
        authStorage.limpar();
        setUsuario(null);
      });
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const { token, usuario } = await api.post<{ token: string; usuario: Usuario }>('/login', { email, senha });
      authStorage.salvar(token, usuario);
      setUsuario(usuario);
      return { ok: true };
    } catch (err) {
      return { ok: false, erro: mensagemErro(err) };
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // Mesmo se a API falhar, a sessão local é encerrada
    }
    authStorage.limpar();
    setUsuario(null);
  };

  const isAuthenticated = !!usuario;

  return (
    <AuthContext.Provider value={{ usuario, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from 'react';
import { api, authStorage, mensagemErro } from '@/lib/api';
import type { Usuario } from '@/types';

interface AuthContextType {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<{ ok: boolean; erro?: string }>;
  logout: () => Promise<void>;
  /** Busca de novo o usuário (perfil e permissões) na API. */
  recarregar: () => Promise<void>;
  /** O usuário tem a permissão do catálogo? (a API também verifica) */
  pode: (permissao: string) => boolean;
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

  const recarregar = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) return;
    try {
      const atual = await api.get<Usuario>('/me');
      authStorage.salvar(token, atual);
      setUsuario(atual);
    } catch {
      authStorage.limpar();
      setUsuario(null);
    }
  }, []);

  // Confirma na API que o token salvo ainda é válido e atualiza perfil/permissões
  useEffect(() => {
    recarregar();
  }, [recarregar]);

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

  const pode = useCallback((permissao: string) => !!usuario?.permissoes?.includes(permissao), [usuario]);

  const isAuthenticated = !!usuario;

  return (
    <AuthContext.Provider value={{ usuario, login, logout, recarregar, pode, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  Home,
  Users,
  Wrench,
  FolderOpen,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  X,
  Waves,
  Building2
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
  { name: 'Funcionários', path: '/funcionarios', icon: <Users className="w-5 h-5" /> },
  { name: 'Equipamentos', path: '/equipamentos', icon: <Wrench className="w-5 h-5" /> },
  { name: 'Projetos', path: '/projetos', icon: <FolderOpen className="w-5 h-5" /> },
  { name: 'Finanças', path: '/financas', icon: <DollarSign className="w-5 h-5" /> },
  { name: 'Configurações', path: '/configuracoes', icon: <Settings className="w-5 h-5" /> },
];

/** Menu do administrador da plataforma (dono do SaaS). */
const menuPlataforma: MenuItem[] = [
  { name: 'Organizações', path: '/plataforma/organizacoes', icon: <Building2 className="w-5 h-5" /> },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Overlay para mobile */}
      {isCollapsed && 
      <button className="pt-2 pl-3 lg:hidden" onClick={onToggle}>
        <Menu className='w-6 h-6'/>
      </button>}

      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-border z-30 
        transition-transform duration-300 ease-in-out shadow-card
        ${isCollapsed ? '-translate-x-full lg:translate-x-0 lg:w-16' : 'translate-x-0 w-72 lg:w-64'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-ocean rounded-lg flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">Sistema Mergulho</h2>
                <p className="text-xs text-muted-foreground">Gestão Profissional</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>

        {/* Usuário */}
        {!isCollapsed && usuario && (
          <div className="p-4 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium">
                  {usuario.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{usuario.nome}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {usuario.administradorPlataforma ? 'Plataforma' : usuario.organizacao?.nome}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {(usuario?.administradorPlataforma ? menuPlataforma : menuItems).map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center px-3 py-2.5 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                    ${isCollapsed ? 'justify-center' : 'space-x-3'}
                  `}
                  >
                  {item.icon}
                  {!isCollapsed && <span className="font-medium">{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`
              w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10
              ${isCollapsed ? 'px-0 justify-center' : 'justify-start space-x-3'}
            `}
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Sair</span>}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
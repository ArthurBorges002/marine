import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { menuOrganizacao, menuPlataforma } from '@/lib/navegacao';
import { cn } from '@/lib/utils';
import Marca from './Marca';
import SeletorTema from './SeletorTema';

interface Props {
  /** Desktop: só ícones. */
  recolhido: boolean;
  onAlternarRecolhido: () => void;
  /** Celular: gaveta aberta. */
  abertoMobile: boolean;
  onFecharMobile: () => void;
}

const Sidebar: React.FC<Props> = ({ recolhido, onAlternarRecolhido, abertoMobile, onFecharMobile }) => {
  const { usuario, logout, pode } = useAuth();
  // Só mostra o que o perfil permite (a API bloqueia de qualquer forma)
  const itens = usuario?.administradorPlataforma
    ? menuPlataforma
    : menuOrganizacao.filter((item) => item.permissao === null || pode(item.permissao));
  // Na gaveta do celular o menu aparece sempre completo
  const compacto = recolhido && !abertoMobile;

  useEffect(() => {
    if (!abertoMobile) return;
    const fecharComEsc = (e: KeyboardEvent) => e.key === 'Escape' && onFecharMobile();
    window.addEventListener('keydown', fecharComEsc);
    return () => window.removeEventListener('keydown', fecharComEsc);
  }, [abertoMobile, onFecharMobile]);

  return (
    <>
      {abertoMobile && (
        <div className="fixed inset-0 z-30 bg-foreground/40 lg:hidden" onClick={onFecharMobile} aria-hidden="true" />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-[transform,width] duration-200 ease-out',
          abertoMobile ? 'w-72 translate-x-0' : '-translate-x-full lg:translate-x-0',
          compacto ? 'lg:w-16' : 'lg:w-64',
        )}
        aria-label="Navegação principal"
      >
        <div className={cn('flex h-16 items-center border-b border-sidebar-border', compacto ? 'justify-center px-2' : 'justify-between px-4')}>
          <Marca compacta={compacto} />
          <Button variant="ghost" size="icon" className="text-muted-foreground lg:hidden" onClick={onFecharMobile} aria-label="Fechar menu">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {itens.map(({ nome, rota, icone: Icone }) => (
              <li key={rota}>
                <NavLink
                  to={rota}
                  end={rota === '/'}
                  onClick={onFecharMobile}
                  title={compacto ? nome : undefined}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                      compacto && 'justify-center px-0',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground hover:bg-muted hover:text-foreground',
                    )
                  }
                >
                  <Icone className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className={cn(compacto && 'sr-only')}>{nome}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-1 border-t border-sidebar-border p-2">
          {usuario && !compacto && (
            <NavLink
              to="/minha-conta"
              onClick={onFecharMobile}
              title="Minha conta"
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-muted',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
                  isActive && 'bg-sidebar-accent',
                )
              }
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground"
                aria-hidden="true"
              >
                {usuario.nome.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground" title={usuario.nome}>{usuario.nome}</p>
                <p className="truncate text-xs text-muted-foreground" title={usuario.organizacao?.nome}>
                  {usuario.administradorPlataforma ? 'Plataforma' : usuario.organizacao?.nome}
                </p>
              </div>
            </NavLink>
          )}

          <div className={cn(compacto && 'flex flex-col items-center gap-1')}>
            <SeletorTema comTexto={!compacto} />
            <Button
              variant="ghost"
              size={compacto ? 'icon' : 'sm'}
              onClick={onAlternarRecolhido}
              className={cn('hidden text-muted-foreground lg:inline-flex', !compacto && 'w-full justify-start gap-3 px-3')}
              aria-label={compacto ? 'Expandir menu' : undefined}
              title={compacto ? 'Expandir menu' : undefined}
            >
              {compacto ? <PanelLeftOpen className="h-4 w-4" aria-hidden="true" /> : <PanelLeftClose className="h-4 w-4" aria-hidden="true" />}
              {!compacto && <span>Recolher menu</span>}
            </Button>
          </div>

          <div className="border-t border-sidebar-border pt-1">
            <Button
              variant="ghost"
              size={compacto ? 'icon' : 'sm'}
              onClick={() => logout()}
              className={cn(
                'text-muted-foreground hover:bg-destructive/10 hover:text-destructive',
                compacto ? 'mx-auto flex' : 'w-full justify-start gap-3 px-3',
              )}
              aria-label={compacto ? 'Sair' : undefined}
              title={compacto ? 'Sair' : undefined}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {!compacto && <span>Sair</span>}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

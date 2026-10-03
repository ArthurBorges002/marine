import React, { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Sidebar from './Sidebar';
import Marca from './Marca';

const CHAVE_RECOLHIDO = 'integra-menu-recolhido';

function lerRecolhido(): boolean {
  try {
    return localStorage.getItem(CHAVE_RECOLHIDO) === '1';
  } catch {
    return false;
  }
}

const Layout: React.FC = () => {
  const [recolhido, setRecolhido] = useState(lerRecolhido);
  const [abertoMobile, setAbertoMobile] = useState(false);
  const { pathname } = useLocation();

  const alternarRecolhido = () => {
    setRecolhido((atual) => {
      try {
        localStorage.setItem(CHAVE_RECOLHIDO, atual ? '0' : '1');
      } catch {
        /* preferência só deste navegador; sem armazenamento, segue sem salvar */
      }
      return !atual;
    });
  };
  const fecharMobile = useCallback(() => setAbertoMobile(false), []);

  // Ao trocar de tela, o foco vai para o conteúdo (leitores de tela anunciam a nova página)
  useEffect(() => {
    document.getElementById('conteudo')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-dvh bg-background">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-card focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-card focus:ring-2 focus:ring-ring"
      >
        Pular para o conteúdo
      </a>

      <Sidebar
        recolhido={recolhido}
        onAlternarRecolhido={alternarRecolhido}
        abertoMobile={abertoMobile}
        onFecharMobile={fecharMobile}
      />

      {/* Barra superior só no celular */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-border bg-card/95 px-4 backdrop-blur lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setAbertoMobile(true)} aria-label="Abrir menu" aria-expanded={abertoMobile}>
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Marca />
      </header>

      <div className={cn('transition-[padding] duration-200 ease-out', recolhido ? 'lg:pl-16' : 'lg:pl-64')}>
        <main id="conteudo" tabIndex={-1} className="mx-auto w-full max-w-7xl p-4 outline-none sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

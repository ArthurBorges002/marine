import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, History, KeyRound, ListChecks, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";

interface Atalho {
  titulo: string;
  descricao: string;
  rota: string;
  icone: LucideIcon;
  permissao: string | null;
}

const GRUPOS: { titulo: string; atalhos: Atalho[] }[] = [
  {
    titulo: "Acesso e segurança",
    atalhos: [
      { titulo: "Usuários", descricao: "Quem acessa o sistema, perfil de cada um e desativação.", rota: "/configuracoes/usuarios", icone: Users, permissao: "admin.usuarios.ver" },
      { titulo: "Perfis e permissões", descricao: "O que cada perfil pode ver e fazer em cada módulo.", rota: "/configuracoes/perfis", icone: ShieldCheck, permissao: "admin.perfis.ver" },
      { titulo: "Auditoria", descricao: "Histórico de alterações e acessos, com antes e depois.", rota: "/configuracoes/auditoria", icone: History, permissao: "admin.auditoria.ver" },
    ],
  },
  {
    titulo: "Cadastros",
    atalhos: [
      { titulo: "Personalizar cadastros", descricao: "Campos que aparecem no cadastro de funcionário.", rota: "/configuracoes/cadastros", icone: ListChecks, permissao: "admin.configuracoes.editar" },
    ],
  },
  {
    titulo: "Sua conta",
    atalhos: [
      { titulo: "Minha conta", descricao: "Seus dados de acesso e troca de senha.", rota: "/minha-conta", icone: KeyRound, permissao: null },
    ],
  },
];

const ConfiguracoesPage: React.FC = () => {
  const { pode } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader titulo="Configurações" descricao="Acessos, cadastros e a sua conta" />

      {GRUPOS.map((grupo) => {
        const atalhos = grupo.atalhos.filter((a) => a.permissao === null || pode(a.permissao));
        if (atalhos.length === 0) return null;

        return (
          <section key={grupo.titulo} className="space-y-3" aria-labelledby={`grupo-${grupo.titulo}`}>
            <h2 id={`grupo-${grupo.titulo}`} className="text-sm font-semibold text-muted-foreground">
              {grupo.titulo}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {atalhos.map(({ titulo, descricao, rota, icone: Icone }) => (
                <Card key={rota} className="shadow-card transition-colors hover:border-primary/40">
                  <Link
                    to={rota}
                    className="flex h-full items-start gap-3 rounded-lg p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <Icone className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{titulo}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{descricao}</p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ConfiguracoesPage;

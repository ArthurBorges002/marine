import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmarAcao from "@/components/ConfirmarAcao";
import DataTable, { type Coluna } from "@/components/DataTable";
import EstadoVazio from "@/components/EstadoVazio";
import PageHeader from "@/components/PageHeader";
import Pode from "@/components/Pode";
import StatusBadge from "@/components/StatusBadge";
import { useAuth } from "@/contexts/AuthContext";
import { api, mensagemErro } from "@/lib/api";
import type { Perfil } from "@/types";

const PerfisPage: React.FC = () => {
  const { pode } = useAuth();
  const queryClient = useQueryClient();
  const [excluindo, setExcluindo] = useState<Perfil | null>(null);
  const gerencia = pode("admin.perfis.gerenciar");

  const consulta = useQuery({ queryKey: ["perfis"], queryFn: () => api.get<Perfil[]>("/perfis") });

  const excluir = useMutation({
    mutationFn: (p: Perfil) => api.delete(`/perfis/${p.id}`),
    onSuccess: (_, p) => {
      queryClient.invalidateQueries({ queryKey: ["perfis"] });
      toast.success(`Perfil "${p.nome}" excluído.`);
      setExcluindo(null);
    },
    onError: (err) => {
      toast.error(mensagemErro(err));
      setExcluindo(null);
    },
  });

  const colunas: Coluna<Perfil>[] = [
    {
      chave: "nome",
      cabecalho: "Perfil",
      celula: (p) => (
        <div>
          <p className="font-medium text-foreground">{p.nome}</p>
          {p.descricao && <p className="text-sm text-muted-foreground">{p.descricao}</p>}
        </div>
      ),
    },
    {
      chave: "permissoes",
      cabecalho: "Permissões",
      celula: (p) =>
        p.administrador ? (
          <StatusBadge tom="info" icone={ShieldCheck}>Acesso total</StatusBadge>
        ) : (
          <span className="tabular-nums">{p.permissoes.length === 0 ? "Nenhuma" : `${p.permissoes.length} permissões`}</span>
        ),
    },
    { chave: "usuarios", cabecalho: "Usuários", alinhar: "direita", numerica: true, celula: (p) => p.usuarios },
    {
      chave: "acoes",
      cabecalho: <span className="sr-only">Ações</span>,
      alinhar: "direita",
      celula: (p) => (
        <div className="flex justify-end gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to={`/configuracoes/perfis/${p.id}`} aria-label={`${gerencia && !p.administrador ? "Editar" : "Ver"} perfil ${p.nome}`}>
              {gerencia && !p.administrador ? "Editar" : "Ver"}
            </Link>
          </Button>
          {gerencia && !p.administrador && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExcluindo(p)}
              disabled={p.usuarios > 0}
              title={p.usuarios > 0 ? "Mude o perfil dos usuários antes de excluir" : undefined}
              aria-label={`Excluir perfil ${p.nome}`}
            >
              Excluir
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        titulo="Perfis e permissões"
        descricao="Cada usuário tem um perfil, que define o que ele pode ver e fazer"
        acoes={
          <Pode permissao="admin.perfis.gerenciar">
            <Button asChild>
              <Link to="/configuracoes/perfis/novo">
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Novo perfil
              </Link>
            </Button>
          </Pode>
        }
      />

      <DataTable
        legenda="Perfis de acesso"
        colunas={colunas}
        dados={consulta.data}
        chaveLinha={(p) => p.id}
        carregando={consulta.isLoading}
        erro={consulta.error}
        onTentarNovamente={() => consulta.refetch()}
        vazio={<EstadoVazio icone={ShieldCheck} titulo="Nenhum perfil" />}
      />

      <ConfirmarAcao
        aberto={excluindo !== null}
        titulo={`Excluir o perfil "${excluindo?.nome}"?`}
        descricao="O perfil e as permissões dele serão removidos. Esta ação não pode ser desfeita."
        textoConfirmar="Excluir"
        destrutivo
        carregando={excluir.isPending}
        onConfirmar={() => excluindo && excluir.mutate(excluindo)}
        onCancelar={() => setExcluindo(null)}
      />
    </div>
  );
};

export default PerfisPage;

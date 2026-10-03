import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CircleCheck, CirclePause, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ConfirmarAcao from "@/components/ConfirmarAcao";
import DataTable, { type Coluna } from "@/components/DataTable";
import EstadoVazio from "@/components/EstadoVazio";
import PageHeader from "@/components/PageHeader";
import StatusBadge from "@/components/StatusBadge";
import { api, mensagemErro } from "@/lib/api";
import { formatarData, formatarDocumento } from "@/lib/formatar";
import type { Organizacao } from "@/types";
import NovaOrganizacaoDialog from "./NovaOrganizacaoDialog";

/** Administração dos clientes do SaaS (só administrador da plataforma). */
const OrganizacoesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [novaAberta, setNovaAberta] = useState(false);
  const [alterando, setAlterando] = useState<Organizacao | null>(null);

  const consulta = useQuery({
    queryKey: ["plataforma", "organizacoes"],
    queryFn: () => api.get<Organizacao[]>("/plataforma/organizacoes"),
  });

  const alterarStatus = useMutation({
    mutationFn: (org: Organizacao) =>
      api.patch<Organizacao>(`/plataforma/organizacoes/${org.id}`, {
        status: org.status === "ativa" ? "suspensa" : "ativa",
      }),
    onSuccess: (org) => {
      queryClient.invalidateQueries({ queryKey: ["plataforma", "organizacoes"] });
      toast.success(
        org.status === "ativa" ? `"${org.nome}" reativada.` : `"${org.nome}" suspensa. Os usuários dela não conseguem mais entrar.`,
      );
      setAlterando(null);
    },
    onError: (err) => toast.error(mensagemErro(err)),
  });

  const colunas: Coluna<Organizacao>[] = [
    { chave: "nome", cabecalho: "Nome", celula: (o) => <span className="font-medium text-foreground">{o.nome}</span> },
    { chave: "documento", cabecalho: "CPF/CNPJ", numerica: true, className: "whitespace-nowrap", celula: (o) => formatarDocumento(o.documento) },
    {
      chave: "status",
      cabecalho: "Status",
      celula: (o) =>
        o.status === "ativa" ? (
          <StatusBadge tom="sucesso" icone={CircleCheck}>Ativa</StatusBadge>
        ) : (
          <StatusBadge tom="perigo" icone={CirclePause}>Suspensa</StatusBadge>
        ),
    },
    { chave: "usuarios", cabecalho: "Usuários", alinhar: "direita", numerica: true, celula: (o) => o.usuarios },
    { chave: "criadaEm", cabecalho: "Criada em", numerica: true, className: "whitespace-nowrap", celula: (o) => formatarData(o.criadaEm) },
    {
      chave: "acoes",
      cabecalho: <span className="sr-only">Ações</span>,
      alinhar: "direita",
      celula: (o) => (
        <Button variant="outline" size="sm" onClick={() => setAlterando(o)} aria-label={`${o.status === "ativa" ? "Suspender" : "Reativar"} ${o.nome}`}>
          {o.status === "ativa" ? "Suspender" : "Reativar"}
        </Button>
      ),
    },
  ];

  const suspendendo = alterando?.status === "ativa";

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        titulo="Organizações"
        descricao="Clientes que usam o Integra"
        acoes={
          <Button onClick={() => setNovaAberta(true)}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Nova organização
          </Button>
        }
      />

      <DataTable
        legenda="Organizações clientes"
        colunas={colunas}
        dados={consulta.data}
        chaveLinha={(o) => o.id}
        carregando={consulta.isLoading}
        erro={consulta.error}
        onTentarNovamente={() => consulta.refetch()}
        vazio={
          <EstadoVazio
            icone={Building2}
            titulo="Nenhuma organização cadastrada"
            descricao="Cadastre o primeiro cliente para que ele comece a usar o sistema."
            acao={
              <Button variant="outline" onClick={() => setNovaAberta(true)}>
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Nova organização
              </Button>
            }
          />
        }
      />

      <NovaOrganizacaoDialog aberto={novaAberta} onAbertoChange={setNovaAberta} />

      <ConfirmarAcao
        aberto={alterando !== null}
        titulo={suspendendo ? `Suspender "${alterando?.nome}"?` : `Reativar "${alterando?.nome}"?`}
        descricao={
          suspendendo
            ? "Os usuários desta organização não conseguirão entrar nem usar sessões já abertas. Os dados são mantidos e você pode reativar quando quiser."
            : "Os usuários desta organização voltam a ter acesso imediatamente."
        }
        textoConfirmar={suspendendo ? "Suspender" : "Reativar"}
        destrutivo={suspendendo}
        carregando={alterarStatus.isPending}
        onConfirmar={() => alterando && alterarStatus.mutate(alterando)}
        onCancelar={() => setAlterando(null)}
      />
    </div>
  );
};

export default OrganizacoesPage;

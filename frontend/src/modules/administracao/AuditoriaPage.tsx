import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, History, LogIn, Pencil, Plus, ShieldAlert, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DataTable, { type Coluna } from "@/components/DataTable";
import EstadoVazio from "@/components/EstadoVazio";
import PageHeader from "@/components/PageHeader";
import StatusBadge, { type TomStatus } from "@/components/StatusBadge";
import { api } from "@/lib/api";
import { formatarDataHora } from "@/lib/formatar";
import type { AcaoAuditoria, PaginaAuditoria, RegistroAuditoria } from "@/types";
import DetalheAuditoriaDialog from "./DetalheAuditoriaDialog";
import { ENTIDADES, NOMES_ACAO } from "./auditoria";

const ESTILO_ACAO: Record<AcaoAuditoria, { tom: TomStatus; icone: typeof Plus }> = {
  criado: { tom: "sucesso", icone: Plus },
  atualizado: { tom: "info", icone: Pencil },
  excluido: { tom: "perigo", icone: Trash2 },
  login: { tom: "neutro", icone: LogIn },
  login_falhou: { tom: "alerta", icone: ShieldAlert },
};

const TODOS = "todos";
const FILTROS = ["entidade", "acao", "de", "ate"] as const;

const AuditoriaPage: React.FC = () => {
  // Filtros na URL: o link pode ser compartilhado e o "voltar" preserva a consulta
  const [params, setParams] = useSearchParams();
  const [detalhe, setDetalhe] = useState<RegistroAuditoria | null>(null);
  const pagina = Math.max(1, Number(params.get("pagina")) || 1);

  const alterarFiltro = (nome: string, valor: string) => {
    const novos = new URLSearchParams(params);
    if (valor && valor !== TODOS) novos.set(nome, valor);
    else novos.delete(nome);
    novos.delete("pagina");
    setParams(novos, { replace: true });
  };

  const irParaPagina = (n: number) => {
    const novos = new URLSearchParams(params);
    novos.set("pagina", String(n));
    setParams(novos);
  };

  const busca = new URLSearchParams();
  FILTROS.forEach((f) => params.get(f) && busca.set(f, params.get(f)!));
  busca.set("page", String(pagina));

  const consulta = useQuery({
    queryKey: ["auditorias", busca.toString()],
    queryFn: () => api.get<PaginaAuditoria>(`/auditorias?${busca.toString()}`),
    placeholderData: keepPreviousData,
  });

  const temFiltro = FILTROS.some((f) => params.get(f));

  const colunas: Coluna<RegistroAuditoria>[] = [
    { chave: "em", cabecalho: "Data e hora", numerica: true, className: "whitespace-nowrap", celula: (r) => formatarDataHora(r.em) },
    { chave: "usuario", cabecalho: "Usuário", celula: (r) => r.usuario?.nome ?? <span className="text-muted-foreground">—</span> },
    {
      chave: "acao",
      cabecalho: "Ação",
      celula: (r) => (
        <StatusBadge tom={ESTILO_ACAO[r.acao].tom} icone={ESTILO_ACAO[r.acao].icone}>
          {NOMES_ACAO[r.acao]}
        </StatusBadge>
      ),
    },
    {
      chave: "registro",
      cabecalho: "Registro",
      celula: (r) =>
        r.entidadeNome ? (
          <span>
            {r.entidadeNome}
            {r.registroId && <span className="tabular-nums text-muted-foreground"> #{r.registroId}</span>}
          </span>
        ) : (
          "—"
        ),
    },
    {
      chave: "detalhe",
      cabecalho: <span className="sr-only">Detalhes</span>,
      alinhar: "direita",
      celula: (r) => (
        <Button variant="outline" size="sm" onClick={() => setDetalhe(r)} aria-label={`Ver detalhes do registro de ${formatarDataHora(r.em)}`}>
          Detalhes
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader titulo="Auditoria" descricao="Quem fez o quê e quando: alterações de cadastros e acessos ao sistema" />

      <div className="grid gap-3 rounded-lg border border-border bg-card p-4 shadow-card sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto_auto_auto] lg:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="filtro-entidade">Registro</Label>
          <Select value={params.get("entidade") ?? TODOS} onValueChange={(v) => alterarFiltro("entidade", v)}>
            <SelectTrigger id="filtro-entidade"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todos</SelectItem>
              {Object.entries(ENTIDADES).map(([chave, nome]) => (
                <SelectItem key={chave} value={chave}>{nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filtro-acao">Ação</Label>
          <Select value={params.get("acao") ?? TODOS} onValueChange={(v) => alterarFiltro("acao", v)}>
            <SelectTrigger id="filtro-acao"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value={TODOS}>Todas</SelectItem>
              {(Object.keys(NOMES_ACAO) as AcaoAuditoria[]).map((acao) => (
                <SelectItem key={acao} value={acao}>{NOMES_ACAO[acao]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filtro-de">De</Label>
          <Input id="filtro-de" type="date" value={params.get("de") ?? ""} onChange={(e) => alterarFiltro("de", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="filtro-ate">Até</Label>
          <Input id="filtro-ate" type="date" value={params.get("ate") ?? ""} min={params.get("de") ?? undefined} onChange={(e) => alterarFiltro("ate", e.target.value)} />
        </div>
        <Button
          variant="ghost"
          onClick={() => setParams(new URLSearchParams(), { replace: true })}
          disabled={!temFiltro}
          className="text-muted-foreground"
        >
          <X className="mr-2 h-4 w-4" aria-hidden="true" />
          Limpar filtros
        </Button>
      </div>

      <DataTable
        legenda="Registros de auditoria"
        colunas={colunas}
        dados={consulta.data?.data}
        chaveLinha={(r) => r.id}
        carregando={consulta.isLoading}
        erro={consulta.error}
        onTentarNovamente={() => consulta.refetch()}
        vazio={
          <EstadoVazio
            icone={History}
            titulo={temFiltro ? "Nenhum registro com esses filtros" : "Nenhum registro ainda"}
            descricao={temFiltro ? "Mude ou limpe os filtros para ver mais registros." : "As alterações e os acessos aparecem aqui conforme acontecem."}
          />
        }
      />

      {consulta.data && consulta.data.total > 0 && (
        <nav className="flex flex-col items-center justify-between gap-3 sm:flex-row" aria-label="Paginação">
          <p className="text-sm text-muted-foreground tabular-nums" aria-live="polite">
            Página {consulta.data.pagina} de {consulta.data.ultimaPagina} · {consulta.data.total} registros
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => irParaPagina(pagina - 1)} disabled={pagina <= 1 || consulta.isFetching}>
              <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => irParaPagina(pagina + 1)}
              disabled={pagina >= consulta.data.ultimaPagina || consulta.isFetching}
            >
              Próxima
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      )}

      <DetalheAuditoriaDialog registro={detalhe} onFechar={() => setDetalhe(null)} />
    </div>
  );
};

export default AuditoriaPage;

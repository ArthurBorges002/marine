import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleCheck, CircleOff, Plus, Users } from "lucide-react";
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
import { formatarDataHora } from "@/lib/formatar";
import type { Usuario } from "@/types";
import UsuarioDialog from "./UsuarioDialog";

const UsuariosPage: React.FC = () => {
  const { usuario: eu, pode } = useAuth();
  const queryClient = useQueryClient();
  const [editando, setEditando] = useState<Usuario | null | undefined>(undefined); // undefined = fechado, null = novo
  const [alterandoAtivo, setAlterandoAtivo] = useState<Usuario | null>(null);

  const consulta = useQuery({ queryKey: ["usuarios"], queryFn: () => api.get<Usuario[]>("/usuarios") });

  const alterarAtivo = useMutation({
    mutationFn: (u: Usuario) => api.put<Usuario>(`/usuarios/${u.id}`, { ativo: !u.ativo }),
    onSuccess: (u) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success(u.ativo ? `${u.nome} pode entrar novamente.` : `${u.nome} foi desativado e desconectado.`);
      setAlterandoAtivo(null);
    },
    onError: (err) => {
      toast.error(mensagemErro(err));
      setAlterandoAtivo(null);
    },
  });

  const podeEditar = pode("admin.usuarios.editar");

  const colunas: Coluna<Usuario>[] = [
    {
      chave: "nome",
      cabecalho: "Usuário",
      celula: (u) => (
        <div className="min-w-0">
          <p className="font-medium text-foreground">
            {u.nome}
            {u.id === eu?.id && <span className="ml-2 text-xs font-normal text-muted-foreground">(você)</span>}
          </p>
          <p className="text-sm text-muted-foreground [overflow-wrap:anywhere]">{u.email}</p>
        </div>
      ),
    },
    { chave: "perfil", cabecalho: "Perfil", celula: (u) => u.perfil?.nome ?? "—" },
    {
      chave: "status",
      cabecalho: "Status",
      celula: (u) =>
        u.ativo ? (
          <StatusBadge tom="sucesso" icone={CircleCheck}>Ativo</StatusBadge>
        ) : (
          <StatusBadge tom="neutro" icone={CircleOff}>Desativado</StatusBadge>
        ),
    },
    { chave: "acesso", cabecalho: "Último acesso", numerica: true, className: "whitespace-nowrap", celula: (u) => formatarDataHora(u.ultimoAcessoEm) },
    {
      chave: "acoes",
      cabecalho: <span className="sr-only">Ações</span>,
      alinhar: "direita",
      celula: (u) =>
        podeEditar && (
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditando(u)} aria-label={`Editar ${u.nome}`}>
              Editar
            </Button>
            {u.id !== eu?.id && (
              <Button variant="outline" size="sm" onClick={() => setAlterandoAtivo(u)} aria-label={`${u.ativo ? "Desativar" : "Reativar"} ${u.nome}`}>
                {u.ativo ? "Desativar" : "Reativar"}
              </Button>
            )}
          </div>
        ),
    },
  ];

  const desativando = alterandoAtivo?.ativo;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        titulo="Usuários"
        descricao="Quem acessa o Integra na sua empresa e com qual perfil"
        acoes={
          <Pode permissao="admin.usuarios.criar">
            <Button onClick={() => setEditando(null)}>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Novo usuário
            </Button>
          </Pode>
        }
      />

      <DataTable
        legenda="Usuários da empresa"
        colunas={colunas}
        dados={consulta.data}
        chaveLinha={(u) => u.id}
        carregando={consulta.isLoading}
        erro={consulta.error}
        onTentarNovamente={() => consulta.refetch()}
        vazio={<EstadoVazio icone={Users} titulo="Nenhum usuário" />}
      />

      <UsuarioDialog
        aberto={editando !== undefined}
        usuario={editando ?? null}
        ehVoce={!!editando && editando.id === eu?.id}
        onFechar={() => setEditando(undefined)}
      />

      <ConfirmarAcao
        aberto={alterandoAtivo !== null}
        titulo={desativando ? `Desativar ${alterandoAtivo?.nome}?` : `Reativar ${alterandoAtivo?.nome}?`}
        descricao={
          desativando
            ? "A pessoa é desconectada na hora e não consegue mais entrar. O histórico dela é mantido e você pode reativar quando quiser."
            : "A pessoa volta a entrar com o mesmo email e senha."
        }
        textoConfirmar={desativando ? "Desativar" : "Reativar"}
        destrutivo={desativando}
        carregando={alterarAtivo.isPending}
        onConfirmar={() => alterandoAtivo && alterarAtivo.mutate(alterandoAtivo)}
        onCancelar={() => setAlterandoAtivo(null)}
      />
    </div>
  );
};

export default UsuariosPage;

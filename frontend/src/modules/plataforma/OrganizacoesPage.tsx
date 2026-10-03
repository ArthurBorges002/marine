import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, CircleCheck, CirclePause, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import QueryState from "@/components/QueryState";
import { api, mensagemErro } from "@/lib/api";
import { formatarData, formatarDocumento } from "@/lib/formatar";
import { cn } from "@/lib/utils";
import type { Organizacao } from "@/types";
import NovaOrganizacaoDialog from "./NovaOrganizacaoDialog";

const StatusOrganizacao: React.FC<{ status: Organizacao["status"] }> = ({ status }) =>
  status === "ativa" ? (
    <Badge variant="outline" className="gap-1 border-success/40 bg-success/10 text-foreground">
      <CircleCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
      Ativa
    </Badge>
  ) : (
    <Badge variant="outline" className="gap-1 border-destructive/40 bg-destructive/10 text-foreground">
      <CirclePause className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
      Suspensa
    </Badge>
  );

/** Administração dos clientes do SaaS (só administrador da plataforma). */
const OrganizacoesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [novaAberta, setNovaAberta] = useState(false);
  const [alterando, setAlterando] = useState<Organizacao | null>(null);

  const { data: organizacoes = [], isLoading, error } = useQuery({
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
      toast.success(org.status === "ativa" ? `"${org.nome}" reativada.` : `"${org.nome}" suspensa. Os usuários dela não conseguem mais entrar.`);
      setAlterando(null);
    },
    onError: (err) => toast.error(mensagemErro(err)),
  });

  const suspendendo = alterando?.status === "ativa";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Organizações</h1>
          <p className="text-muted-foreground">Clientes que usam o Integra</p>
        </div>
        <Button onClick={() => setNovaAberta(true)}>
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Nova organização
        </Button>
      </div>

      <QueryState isLoading={isLoading} error={error} />

      {!isLoading && !error && organizacoes.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center text-center gap-3 py-12">
            <Building2 className="w-10 h-10 text-muted-foreground" aria-hidden="true" />
            <div>
              <p className="font-medium text-foreground">Nenhuma organização cadastrada</p>
              <p className="text-sm text-muted-foreground">Cadastre o primeiro cliente para que ele comece a usar o sistema.</p>
            </div>
            <Button variant="outline" onClick={() => setNovaAberta(true)}>
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Nova organização
            </Button>
          </CardContent>
        </Card>
      )}

      {organizacoes.length > 0 && (
        <Card className="shadow-card">
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Usuários</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead className="text-right">
                    <span className="sr-only">Ações</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizacoes.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.nome}</TableCell>
                    <TableCell className="tabular-nums whitespace-nowrap">{formatarDocumento(org.documento)}</TableCell>
                    <TableCell>
                      <StatusOrganizacao status={org.status} />
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{org.usuarios}</TableCell>
                    <TableCell className="tabular-nums whitespace-nowrap">{formatarData(org.criadaEm)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAlterando(org)}
                        aria-label={`${org.status === "ativa" ? "Suspender" : "Reativar"} ${org.nome}`}
                      >
                        {org.status === "ativa" ? "Suspender" : "Reativar"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <NovaOrganizacaoDialog aberto={novaAberta} onAbertoChange={setNovaAberta} />

      <AlertDialog open={alterando !== null} onOpenChange={(abrir) => !abrir && !alterarStatus.isPending && setAlterando(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {suspendendo ? `Suspender "${alterando?.nome}"?` : `Reativar "${alterando?.nome}"?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {suspendendo
                ? "Os usuários desta organização não conseguirão entrar nem usar sessões já abertas. Os dados são mantidos e você pode reativar quando quiser."
                : "Os usuários desta organização voltam a ter acesso imediatamente."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={alterarStatus.isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={alterarStatus.isPending}
              className={cn(suspendendo && "bg-destructive text-destructive-foreground hover:bg-destructive/90")}
              onClick={(e) => {
                e.preventDefault(); // mantém o diálogo aberto até a API responder
                if (alterando) alterarStatus.mutate(alterando);
              }}
            >
              {alterarStatus.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              {suspendendo ? "Suspender" : "Reativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrganizacoesPage;

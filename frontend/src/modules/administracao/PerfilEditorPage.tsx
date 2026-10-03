import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Info, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import CampoFormulario from "@/components/CampoFormulario";
import ConfirmarAcao from "@/components/ConfirmarAcao";
import PageHeader from "@/components/PageHeader";
import QueryState from "@/components/QueryState";
import { useAuth } from "@/contexts/AuthContext";
import { api, mensagemErro } from "@/lib/api";
import { errosPorCampo, focarPrimeiroErro } from "@/lib/formularios";
import type { ModuloPermissoes, Perfil } from "@/types";

type Campo = "nome" | "descricao";
const CHAVES: Record<Campo, string> = { nome: "nome", descricao: "descricao" };

/** Criação/edição de perfil com a matriz de permissões agrupada por módulo. */
const PerfilEditorPage: React.FC = () => {
  const { id } = useParams();
  const novo = id === undefined;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pode, recarregar } = useAuth();

  const perfis = useQuery({ queryKey: ["perfis"], queryFn: () => api.get<Perfil[]>("/perfis"), enabled: !novo });
  const catalogo = useQuery({ queryKey: ["perfis", "catalogo"], queryFn: () => api.get<ModuloPermissoes[]>("/perfis/catalogo") });
  const perfil = novo ? null : perfis.data?.find((p) => String(p.id) === id) ?? null;

  const somenteLeitura = !pode("admin.perfis.gerenciar") || !!perfil?.administrador;

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [marcadas, setMarcadas] = useState<Set<string>>(new Set());
  const [inicial, setInicial] = useState("");
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [descartando, setDescartando] = useState(false);

  useEffect(() => {
    if (novo || !perfil) return;
    setNome(perfil.nome);
    setDescricao(perfil.descricao ?? "");
    setMarcadas(new Set(perfil.permissoes));
    setInicial(JSON.stringify([perfil.nome, perfil.descricao ?? "", [...perfil.permissoes].sort()]));
  }, [novo, perfil]);

  useEffect(() => {
    if (novo) setInicial(JSON.stringify(["", "", []]));
  }, [novo]);

  const alterado = useMemo(
    () => JSON.stringify([nome, descricao, [...marcadas].sort()]) !== inicial,
    [nome, descricao, marcadas, inicial],
  );

  // Aviso do navegador ao fechar/recarregar com alterações não salvas
  useEffect(() => {
    if (!alterado || somenteLeitura) return;
    const avisar = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avisar);
    return () => window.removeEventListener("beforeunload", avisar);
  }, [alterado, somenteLeitura]);

  const salvar = useMutation({
    mutationFn: () => {
      const corpo = { nome, descricao: descricao || null, permissoes: [...marcadas] };
      return novo ? api.post<Perfil>("/perfis", corpo) : api.put<Perfil>(`/perfis/${id}`, corpo);
    },
    onSuccess: async (salvo) => {
      await queryClient.invalidateQueries({ queryKey: ["perfis"] });
      await recarregar(); // se for o meu perfil, o menu já reflete a mudança
      toast.success(novo ? `Perfil "${salvo.nome}" criado.` : `Perfil "${salvo.nome}" salvo. As permissões valem a partir de agora.`);
      setInicial(JSON.stringify([salvo.nome, salvo.descricao ?? "", [...salvo.permissoes].sort()]));
      navigate("/configuracoes/perfis");
    },
    onError: (err) => {
      const porCampo = errosPorCampo(err, CHAVES);
      if (!porCampo || Object.keys(porCampo).length === 0) return toast.error(mensagemErro(err));
      setErros(porCampo);
      focarPrimeiroErro(["nome", "descricao"], porCampo, "perfil-");
    },
  });

  const alternar = (chave: string, marcar: boolean) =>
    setMarcadas((atual) => {
      const nova = new Set(atual);
      if (marcar) nova.add(chave);
      else nova.delete(chave);
      return nova;
    });

  const alternarModulo = (modulo: ModuloPermissoes, marcar: boolean) =>
    setMarcadas((atual) => {
      const nova = new Set(atual);
      modulo.permissoes.forEach((p) => {
        if (marcar) nova.add(p.chave);
        else nova.delete(p.chave);
      });
      return nova;
    });

  const voltar = () => (alterado && !somenteLeitura ? setDescartando(true) : navigate("/configuracoes/perfis"));

  const carregando = catalogo.isLoading || (!novo && perfis.isLoading);
  const naoEncontrado = !novo && !perfis.isLoading && !perfis.error && !perfil;

  const titulo = novo ? "Novo perfil" : perfil ? perfil.nome : "Perfil";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground">
          <Link to="/configuracoes/perfis" onClick={(e) => { if (alterado && !somenteLeitura) { e.preventDefault(); setDescartando(true); } }}>
            <ArrowLeft className="mr-1 h-4 w-4" aria-hidden="true" />
            Perfis e permissões
          </Link>
        </Button>
        <PageHeader
          titulo={titulo}
          descricao={somenteLeitura ? "Visualização das permissões deste perfil" : "Marque o que este perfil pode ver e fazer"}
        />
      </div>

      <QueryState isLoading={false} error={perfis.error || catalogo.error} />
      {naoEncontrado && <p className="text-muted-foreground">Perfil não encontrado.</p>}

      {perfil?.administrador && (
        <Alert>
          <Info className="h-4 w-4" aria-hidden="true" />
          <AlertDescription>
            O Administrador tem <strong>acesso total</strong>, inclusive a permissões de módulos novos. Ele não pode ser alterado nem excluído.
          </AlertDescription>
        </Alert>
      )}

      {carregando ? (
        <Card className="shadow-card">
          <CardContent className="space-y-3 p-6">
            {Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-5 w-full max-w-md" />)}
          </CardContent>
        </Card>
      ) : (
        !naoEncontrado &&
        catalogo.data && (
          <form
            className="space-y-6"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              if (!somenteLeitura) salvar.mutate();
            }}
          >
            {!somenteLeitura && (
              <Card className="shadow-card">
                <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                  <CampoFormulario id="perfil-nome" rotulo="Nome" obrigatorio erro={erros.nome}>
                    {(p) => (
                      <Input
                        {...p}
                        value={nome}
                        onChange={(e) => { setNome(e.target.value); setErros((x) => ({ ...x, nome: undefined })); }}
                        maxLength={60}
                        required
                      />
                    )}
                  </CampoFormulario>
                  <CampoFormulario id="perfil-descricao" rotulo="Descrição" ajuda="Opcional. Para que serve este perfil." erro={erros.descricao}>
                    {(p) => <Input {...p} value={descricao} onChange={(e) => setDescricao(e.target.value)} maxLength={255} />}
                  </CampoFormulario>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              {catalogo.data.map((modulo) => {
                const chaves = modulo.permissoes.map((p) => p.chave);
                const qtd = chaves.filter((c) => marcadas.has(c) || perfil?.administrador).length;
                const estadoModulo = qtd === 0 ? false : qtd === chaves.length ? true : "indeterminate";
                const idModulo = `modulo-${modulo.modulo}`;

                return (
                  <Card key={modulo.modulo} className="shadow-card">
                    <fieldset className="p-5">
                      <legend className="sr-only">{modulo.modulo}</legend>
                      <div className="mb-3 flex items-center justify-between gap-3 border-b border-border pb-3">
                        <p className="font-semibold text-foreground" aria-hidden="true">{modulo.modulo}</p>
                        <span className="text-xs tabular-nums text-muted-foreground">
                          {qtd} de {chaves.length}
                        </span>
                      </div>

                      {somenteLeitura ? (
                        <ul className="space-y-2">
                          {modulo.permissoes.map((p) => {
                            const tem = perfil?.administrador || marcadas.has(p.chave);
                            return (
                              <li key={p.chave} className="flex items-center gap-2 text-sm">
                                {tem ? (
                                  <Check className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                                ) : (
                                  <span className="h-4 w-4 shrink-0" aria-hidden="true" />
                                )}
                                <span className={tem ? "text-foreground" : "text-muted-foreground line-through"}>{p.descricao}</span>
                                <span className="sr-only">{tem ? "(permitido)" : "(não permitido)"}</span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="space-y-2">
                          <label htmlFor={idModulo} className="flex min-h-9 cursor-pointer items-center gap-3 rounded-md px-2 text-sm font-medium hover:bg-muted">
                            <Checkbox
                              id={idModulo}
                              checked={estadoModulo}
                              onCheckedChange={() => alternarModulo(modulo, estadoModulo !== true)}
                            />
                            Todas de {modulo.modulo}
                          </label>
                          <div className="space-y-1 border-l border-border pl-3 ml-4">
                            {modulo.permissoes.map((p) => (
                              <label
                                key={p.chave}
                                htmlFor={`permissao-${p.chave}`}
                                className="flex min-h-9 cursor-pointer items-center gap-3 rounded-md px-2 text-sm hover:bg-muted"
                              >
                                <Checkbox
                                  id={`permissao-${p.chave}`}
                                  checked={marcadas.has(p.chave)}
                                  onCheckedChange={(v) => alternar(p.chave, v === true)}
                                />
                                {p.descricao}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </fieldset>
                  </Card>
                );
              })}
            </div>

            {!somenteLeitura && (
              <div className="sticky bottom-0 -mx-4 flex flex-col-reverse gap-2 border-t border-border bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:flex-row sm:justify-end sm:px-6 lg:-mx-8 lg:px-8">
                <Button type="button" variant="outline" onClick={voltar} disabled={salvar.isPending}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={salvar.isPending || (!novo && !alterado)}>
                  {salvar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                  {salvar.isPending ? "Salvando..." : novo ? "Criar perfil" : "Salvar alterações"}
                </Button>
              </div>
            )}
          </form>
        )
      )}

      <ConfirmarAcao
        aberto={descartando}
        titulo="Descartar as alterações?"
        descricao="As mudanças feitas neste perfil ainda não foram salvas e serão perdidas."
        textoConfirmar="Descartar"
        destrutivo
        onConfirmar={() => navigate("/configuracoes/perfis")}
        onCancelar={() => setDescartando(false)}
      />
    </div>
  );
};

export default PerfilEditorPage;

import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CampoFormulario from "@/components/CampoFormulario";
import { api, mensagemErro } from "@/lib/api";
import { errosPorCampo, focarPrimeiroErro } from "@/lib/formularios";
import type { Usuario } from "@/types";

interface Props {
  aberto: boolean;
  /** null = novo usuário */
  usuario: Usuario | null;
  /** O próprio usuário logado: não pode trocar o próprio perfil. */
  ehVoce: boolean;
  onFechar: () => void;
}

const VAZIO = { nome: "", email: "", perfil_id: "", senha: "" };
type Campo = keyof typeof VAZIO;
const CHAVES: Record<Campo, string> = { nome: "nome", email: "email", perfil_id: "perfil_id", senha: "senha" };

const UsuarioDialog: React.FC<Props> = ({ aberto, usuario, ehVoce, onFechar }) => {
  const queryClient = useQueryClient();
  const editando = usuario !== null;
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    setForm(usuario ? { nome: usuario.nome, email: usuario.email, perfil_id: String(usuario.perfil?.id ?? ""), senha: "" } : VAZIO);
    setErros({});
    setMostrarSenha(false);
  }, [aberto, usuario]);

  const perfis = useQuery({
    queryKey: ["usuarios", "perfis"],
    queryFn: () => api.get<{ id: number; nome: string }[]>("/usuarios/perfis"),
    enabled: aberto,
  });

  const salvar = useMutation({
    mutationFn: () => {
      const corpo: Record<string, unknown> = { nome: form.nome, email: form.email, perfil_id: Number(form.perfil_id) || null };
      if (!editando || form.senha) corpo.senha = form.senha;
      if (editando && ehVoce) delete corpo.perfil_id;
      return usuario ? api.put<Usuario>(`/usuarios/${usuario.id}`, corpo) : api.post<Usuario>("/usuarios", corpo);
    },
    onSuccess: (salvo) => {
      queryClient.invalidateQueries({ queryKey: ["usuarios"] });
      toast.success(editando ? `Dados de ${salvo.nome} atualizados.` : `${salvo.nome} já pode entrar no sistema.`);
      onFechar();
    },
    onError: (err) => {
      const porCampo = errosPorCampo(err, CHAVES);
      if (!porCampo) return toast.error(mensagemErro(err));
      setErros(porCampo);
      focarPrimeiroErro(Object.keys(CHAVES) as Campo[], porCampo, "usuario-");
    },
  });

  const valor = (campo: Campo) => ({
    value: form[campo],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [campo]: e.target.value }));
      if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
    },
  });

  return (
    <Dialog open={aberto} onOpenChange={(abrir) => !abrir && !salvar.isPending && onFechar()}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editando ? "Editar usuário" : "Novo usuário"}</DialogTitle>
          <DialogDescription>
            {editando ? "Altere os dados de acesso. Deixe a senha em branco para manter a atual." : "A pessoa entra com o email e a senha definidos aqui."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-usuario"
          className="space-y-4"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            salvar.mutate();
          }}
        >
          <CampoFormulario id="usuario-nome" rotulo="Nome" obrigatorio erro={erros.nome}>
            {(p) => <Input {...p} {...valor("nome")} required autoComplete="off" />}
          </CampoFormulario>
          <CampoFormulario id="usuario-email" rotulo="Email" obrigatorio ajuda="É o login da pessoa." erro={erros.email}>
            {(p) => <Input {...p} {...valor("email")} type="email" required autoComplete="off" />}
          </CampoFormulario>
          <CampoFormulario
            id="usuario-perfil_id"
            rotulo="Perfil"
            obrigatorio
            ajuda={ehVoce ? "Você não pode trocar o seu próprio perfil." : "Define o que a pessoa pode ver e fazer."}
            erro={erros.perfil_id}
          >
            {(p) => (
              <Select
                value={form.perfil_id}
                onValueChange={(v) => {
                  setForm((f) => ({ ...f, perfil_id: v }));
                  setErros((atual) => ({ ...atual, perfil_id: undefined }));
                }}
                disabled={ehVoce || perfis.isLoading}
              >
                <SelectTrigger id={p.id} aria-invalid={p["aria-invalid"]} aria-describedby={p["aria-describedby"]} className={p["aria-invalid"] ? "border-destructive" : undefined}>
                  <SelectValue placeholder={perfis.isLoading ? "Carregando perfis..." : "Selecione o perfil"} />
                </SelectTrigger>
                <SelectContent>
                  {perfis.data?.map((perfil) => (
                    <SelectItem key={perfil.id} value={String(perfil.id)}>
                      {perfil.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </CampoFormulario>
          <div className="relative">
            <CampoFormulario
              id="usuario-senha"
              rotulo={editando ? "Nova senha" : "Senha"}
              obrigatorio={!editando}
              ajuda={editando ? "Opcional. Mínimo de 8 caracteres." : "Mínimo de 8 caracteres."}
              erro={erros.senha}
            >
              {(p) => <Input {...p} {...valor("senha")} type={mostrarSenha ? "text" : "password"} autoComplete="new-password" className="pr-11" />}
            </CampoFormulario>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-[30px] h-8 w-8 text-muted-foreground"
              onClick={() => setMostrarSenha((m) => !m)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={mostrarSenha}
            >
              {mostrarSenha ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </div>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={onFechar} disabled={salvar.isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="form-usuario" disabled={salvar.isPending}>
            {salvar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            {salvar.isPending ? "Salvando..." : editando ? "Salvar" : "Criar usuário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsuarioDialog;

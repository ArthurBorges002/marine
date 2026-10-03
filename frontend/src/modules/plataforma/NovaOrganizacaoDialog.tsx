import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import CampoFormulario from "@/components/CampoFormulario";
import { api, ApiError, mensagemErro } from "@/lib/api";
import type { Organizacao } from "@/types";

interface Props {
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
}

const VAZIO = { nome: "", documento: "", adminNome: "", adminEmail: "", adminSenha: "" };
type Campo = keyof typeof VAZIO;

/** Campo do formulário → chave de erro devolvida pela API (422), na ordem do formulário. */
const CHAVES_API: Record<Campo, string> = {
  nome: "nome",
  documento: "documento",
  adminNome: "administrador.nome",
  adminEmail: "administrador.email",
  adminSenha: "administrador.senha",
};

const NovaOrganizacaoDialog: React.FC<Props> = ({ aberto, onAbertoChange }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const fechar = (abrir: boolean) => {
    if (!abrir) {
      setForm(VAZIO);
      setErros({});
      setMostrarSenha(false);
    }
    onAbertoChange(abrir);
  };

  const criar = useMutation({
    mutationFn: () =>
      api.post<Organizacao>("/plataforma/organizacoes", {
        nome: form.nome,
        documento: form.documento,
        administrador: { nome: form.adminNome, email: form.adminEmail, senha: form.adminSenha },
      }),
    onSuccess: (organizacao) => {
      queryClient.invalidateQueries({ queryKey: ["plataforma", "organizacoes"] });
      toast.success(`Organização "${organizacao.nome}" criada. O administrador já pode entrar.`);
      fechar(false);
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 422 && err.errors) {
        const novos: Partial<Record<Campo, string>> = {};
        (Object.keys(CHAVES_API) as Campo[]).forEach((campo) => {
          const mensagem = err.errors?.[CHAVES_API[campo]]?.[0];
          if (mensagem) novos[campo] = mensagem;
        });
        setErros(novos);
        // Foco no primeiro campo inválido
        const primeiro = (Object.keys(CHAVES_API) as Campo[]).find((c) => novos[c]);
        if (primeiro) document.getElementById(`org-${primeiro}`)?.focus();
        return;
      }
      toast.error(mensagemErro(err));
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
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova organização</DialogTitle>
          <DialogDescription>
            Cadastre o cliente e o primeiro administrador. Ele entra com o email e a senha abaixo e cadastra o restante da equipe.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-nova-organizacao"
          className="space-y-6"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            criar.mutate();
          }}
        >
          <fieldset className="space-y-4">
            <legend className="mb-1 text-sm font-semibold text-foreground">Organização</legend>
            <CampoFormulario id="org-nome" rotulo="Nome" obrigatorio erro={erros.nome}>
              {(p) => <Input {...p} {...valor("nome")} required autoComplete="organization" />}
            </CampoFormulario>
            <CampoFormulario id="org-documento" rotulo="CPF ou CNPJ" ajuda="Opcional. Só números ou com pontuação." erro={erros.documento}>
              {(p) => <Input {...p} {...valor("documento")} inputMode="numeric" />}
            </CampoFormulario>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-sm font-semibold text-foreground">Primeiro administrador</legend>
            <CampoFormulario id="org-adminNome" rotulo="Nome" obrigatorio erro={erros.adminNome}>
              {(p) => <Input {...p} {...valor("adminNome")} required autoComplete="off" />}
            </CampoFormulario>
            <CampoFormulario id="org-adminEmail" rotulo="Email" obrigatorio erro={erros.adminEmail}>
              {(p) => <Input {...p} {...valor("adminEmail")} type="email" required autoComplete="off" />}
            </CampoFormulario>
            <div className="relative">
              <CampoFormulario id="org-adminSenha" rotulo="Senha" obrigatorio ajuda="Mínimo de 8 caracteres." erro={erros.adminSenha}>
                {(p) => (
                  <Input
                    {...p}
                    {...valor("adminSenha")}
                    type={mostrarSenha ? "text" : "password"}
                    required
                    autoComplete="new-password"
                    className="pr-11"
                  />
                )}
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
          </fieldset>
        </form>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => fechar(false)} disabled={criar.isPending}>
            Cancelar
          </Button>
          <Button type="submit" form="form-nova-organizacao" disabled={criar.isPending}>
            {criar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            {criar.isPending ? "Criando..." : "Criar organização"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NovaOrganizacaoDialog;

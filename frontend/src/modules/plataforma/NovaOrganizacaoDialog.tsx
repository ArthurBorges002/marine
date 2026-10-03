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
import { Label } from "@/components/ui/label";
import { api, ApiError, mensagemErro } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Organizacao } from "@/types";

interface Props {
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
}

const VAZIO = { nome: "", documento: "", adminNome: "", adminEmail: "", adminSenha: "" };

/** Campo do formulário → chave de erro devolvida pela API (422). */
const CHAVES_API: Record<keyof typeof VAZIO, string> = {
  nome: "nome",
  documento: "documento",
  adminNome: "administrador.nome",
  adminEmail: "administrador.email",
  adminSenha: "administrador.senha",
};

const NovaOrganizacaoDialog: React.FC<Props> = ({ aberto, onAbertoChange }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState<Partial<Record<keyof typeof VAZIO, string>>>({});
  const [mostrarSenha, setMostrarSenha] = useState(false);

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
        const novos: typeof erros = {};
        (Object.keys(CHAVES_API) as (keyof typeof VAZIO)[]).forEach((campo) => {
          const mensagem = err.errors?.[CHAVES_API[campo]]?.[0];
          if (mensagem) novos[campo] = mensagem;
        });
        setErros(novos);
        // Foco no primeiro campo inválido, na ordem do formulário
        const primeiro = (Object.keys(VAZIO) as (keyof typeof VAZIO)[]).find((c) => novos[c]);
        if (primeiro) document.getElementById(`org-${primeiro}`)?.focus();
        return;
      }
      toast.error(mensagemErro(err));
    },
  });

  const fechar = (abrir: boolean) => {
    if (!abrir) {
      setForm(VAZIO);
      setErros({});
      setMostrarSenha(false);
    }
    onAbertoChange(abrir);
  };

  const alterar = (campo: keyof typeof VAZIO) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [campo]: e.target.value }));
    if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
  };

  const campo = (
    nome: keyof typeof VAZIO,
    rotulo: string,
    props: React.InputHTMLAttributes<HTMLInputElement> & { obrigatorio?: boolean; ajuda?: string } = {},
  ) => {
    const { obrigatorio, ajuda, className, ...inputProps } = props;
    const id = `org-${nome}`;
    const descricao = [ajuda && `${id}-ajuda`, erros[nome] && `${id}-erro`].filter(Boolean).join(" ") || undefined;
    return (
      <div className="space-y-1.5">
        <Label htmlFor={id}>
          {rotulo}
          {obrigatorio && <span className="text-destructive" aria-hidden="true"> *</span>}
        </Label>
        <Input
          id={id}
          value={form[nome]}
          onChange={alterar(nome)}
          required={obrigatorio}
          aria-invalid={!!erros[nome]}
          aria-describedby={descricao}
          className={cn(erros[nome] && "border-destructive focus-visible:ring-destructive", className)}
          {...inputProps}
        />
        {ajuda && !erros[nome] && (
          <p id={`${id}-ajuda`} className="text-xs text-muted-foreground">{ajuda}</p>
        )}
        {erros[nome] && (
          <p id={`${id}-erro`} className="text-sm text-destructive" role="alert">{erros[nome]}</p>
        )}
      </div>
    );
  };

  return (
    <Dialog open={aberto} onOpenChange={fechar}>
      <DialogContent className="sm:max-w-lg max-h-[90dvh] overflow-y-auto">
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
            <legend className="text-sm font-semibold text-foreground mb-1">Organização</legend>
            {campo("nome", "Nome", { obrigatorio: true, autoComplete: "organization" })}
            {campo("documento", "CPF ou CNPJ", { inputMode: "numeric", ajuda: "Opcional. Só números ou com pontuação." })}
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-foreground mb-1">Primeiro administrador</legend>
            {campo("adminNome", "Nome", { obrigatorio: true, autoComplete: "off" })}
            {campo("adminEmail", "Email", { obrigatorio: true, type: "email", autoComplete: "off" })}
            <div className="relative">
              {campo("adminSenha", "Senha", {
                obrigatorio: true,
                type: mostrarSenha ? "text" : "password",
                autoComplete: "new-password",
                ajuda: "Mínimo de 8 caracteres.",
                className: "pr-11",
              })}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-[30px] h-8 w-8"
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

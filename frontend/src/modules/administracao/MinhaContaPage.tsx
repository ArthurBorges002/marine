import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CampoFormulario from "@/components/CampoFormulario";
import PageHeader from "@/components/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { api, mensagemErro } from "@/lib/api";
import { formatarDataHora } from "@/lib/formatar";
import { errosPorCampo, focarPrimeiroErro } from "@/lib/formularios";

const VAZIO = { senha_atual: "", nova_senha: "", nova_senha_confirmation: "" };
type Campo = keyof typeof VAZIO;
const CHAVES: Record<Campo, string> = { senha_atual: "senha_atual", nova_senha: "nova_senha", nova_senha_confirmation: "nova_senha_confirmation" };

const MinhaContaPage: React.FC = () => {
  const { usuario } = useAuth();
  const [form, setForm] = useState(VAZIO);
  const [erros, setErros] = useState<Partial<Record<Campo, string>>>({});

  const trocar = useMutation({
    mutationFn: () => api.put("/me/senha", form),
    onSuccess: () => {
      setForm(VAZIO);
      setErros({});
      toast.success("Senha alterada. As outras sessões abertas foram encerradas.");
    },
    onError: (err) => {
      const porCampo = errosPorCampo(err, CHAVES);
      if (!porCampo) return toast.error(mensagemErro(err));
      setErros(porCampo);
      focarPrimeiroErro(Object.keys(CHAVES) as Campo[], porCampo, "conta-");
    },
  });

  const valor = (campo: Campo) => ({
    value: form[campo],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [campo]: e.target.value }));
      if (erros[campo]) setErros((atual) => ({ ...atual, [campo]: undefined }));
    },
  });

  const dados: [string, string][] = [
    ["Nome", usuario?.nome ?? "—"],
    ["Email (login)", usuario?.email ?? "—"],
    ["Empresa", usuario?.administradorPlataforma ? "Administração da plataforma" : usuario?.organizacao?.nome ?? "—"],
    ["Perfil", usuario?.administradorPlataforma ? "—" : usuario?.perfil?.nome ?? "—"],
    ["Último acesso", formatarDataHora(usuario?.ultimoAcessoEm)],
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader titulo="Minha conta" descricao="Seus dados de acesso" />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Dados de acesso</CardTitle>
            <CardDescription>Para mudar nome, email ou perfil, fale com o administrador da sua empresa.</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="divide-y divide-border">
              {dados.map(([rotulo, valorCampo]) => (
                <div key={rotulo} className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:justify-between sm:gap-4">
                  <dt className="text-sm text-muted-foreground">{rotulo}</dt>
                  <dd className="text-sm font-medium text-foreground [overflow-wrap:anywhere] sm:text-right">{valorCampo}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Trocar senha</CardTitle>
            <CardDescription>As outras sessões abertas com a sua conta serão encerradas.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                trocar.mutate();
              }}
            >
              {/* Campo oculto de usuário: ajuda gerenciadores de senha a associar a conta */}
              <input type="email" autoComplete="username" value={usuario?.email ?? ""} readOnly hidden />
              <CampoFormulario id="conta-senha_atual" rotulo="Senha atual" obrigatorio erro={erros.senha_atual}>
                {(p) => <Input {...p} {...valor("senha_atual")} type="password" autoComplete="current-password" required />}
              </CampoFormulario>
              <CampoFormulario id="conta-nova_senha" rotulo="Nova senha" obrigatorio ajuda="Mínimo de 8 caracteres." erro={erros.nova_senha}>
                {(p) => <Input {...p} {...valor("nova_senha")} type="password" autoComplete="new-password" required />}
              </CampoFormulario>
              <CampoFormulario id="conta-nova_senha_confirmation" rotulo="Confirme a nova senha" obrigatorio erro={erros.nova_senha_confirmation}>
                {(p) => <Input {...p} {...valor("nova_senha_confirmation")} type="password" autoComplete="new-password" required />}
              </CampoFormulario>
              <Button type="submit" disabled={trocar.isPending}>
                {trocar.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                {trocar.isPending ? "Salvando..." : "Trocar senha"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MinhaContaPage;

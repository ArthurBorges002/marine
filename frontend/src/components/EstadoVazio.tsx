import React from "react";
import type { LucideIcon } from "lucide-react";

interface Props {
  icone: LucideIcon;
  titulo: string;
  descricao?: string;
  /** Ação que resolve o vazio (ex.: "Novo cadastro"). */
  acao?: React.ReactNode;
}

/** Mensagem + ação quando não há conteúdo — nunca uma área em branco. */
const EstadoVazio: React.FC<Props> = ({ icone: Icone, titulo, descricao, acao }) => (
  <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
      <Icone className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
    </div>
    <div className="space-y-1">
      <p className="font-semibold text-foreground">{titulo}</p>
      {descricao && <p className="max-w-sm text-sm text-muted-foreground">{descricao}</p>}
    </div>
    {acao}
  </div>
);

export default EstadoVazio;

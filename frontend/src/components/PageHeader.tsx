import React from "react";

interface Props {
  titulo: string;
  descricao?: string;
  /** Ação principal da tela (uma só) e, se houver, ações secundárias à esquerda dela. */
  acoes?: React.ReactNode;
}

/** Cabeçalho padrão de página: título (h1), descrição e ações. */
const PageHeader: React.FC<Props> = ({ titulo, descricao, acoes }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div className="min-w-0">
      <h1 className="text-2xl font-bold tracking-tight text-foreground">{titulo}</h1>
      {descricao && <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>}
    </div>
    {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
  </div>
);

export default PageHeader;

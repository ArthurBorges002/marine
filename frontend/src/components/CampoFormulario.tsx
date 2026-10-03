import React from "react";
import { Label } from "@/components/ui/label";

/** Atributos que o campo (Input, Select...) precisa receber para ficar ligado ao rótulo, à ajuda e ao erro. */
export interface PropsCampo {
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
}

interface Props {
  id: string;
  rotulo: string;
  obrigatorio?: boolean;
  /** Texto de apoio permanente (some quando há erro). */
  ajuda?: string;
  erro?: string;
  children: (campo: PropsCampo) => React.ReactNode;
}

/**
 * Rótulo visível + campo + ajuda + erro logo abaixo, ligados por aria-describedby.
 * Uso: <CampoFormulario id="email" rotulo="Email" erro={erros.email}>{(p) => <Input {...p} />}</CampoFormulario>
 */
const CampoFormulario: React.FC<Props> = ({ id, rotulo, obrigatorio, ajuda, erro, children }) => {
  const descricao = erro ? `${id}-erro` : ajuda ? `${id}-ajuda` : undefined;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {rotulo}
        {obrigatorio && (
          <span className="text-destructive" aria-hidden="true">
            {" "}*
          </span>
        )}
      </Label>
      {children({ id, "aria-invalid": !!erro, "aria-describedby": descricao })}
      {erro ? (
        <p id={`${id}-erro`} className="text-sm text-destructive" role="alert">
          {erro}
        </p>
      ) : (
        ajuda && (
          <p id={`${id}-ajuda`} className="text-xs text-muted-foreground">
            {ajuda}
          </p>
        )
      )}
    </div>
  );
};

export default CampoFormulario;

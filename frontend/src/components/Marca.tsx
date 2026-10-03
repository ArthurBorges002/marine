import React from "react";
import { cn } from "@/lib/utils";

interface Props {
  /** Só o símbolo, sem o nome (menu recolhido). */
  compacta?: boolean;
  className?: string;
}

/** Marca do Integra: símbolo + nome. */
const Marca: React.FC<Props> = ({ compacta, className }) => (
  <div className={cn("flex items-center gap-2.5", className)}>
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
        <path d="M7 6.5h10M12 6.5v11M7 17.5h10" />
      </svg>
    </div>
    {!compacta && <span className="text-lg font-bold tracking-tight text-foreground">Integra</span>}
    {compacta && <span className="sr-only">Integra</span>}
  </div>
);

export default Marca;

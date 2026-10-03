import React from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type TomStatus = "sucesso" | "perigo" | "alerta" | "info" | "neutro";

const TONS: Record<TomStatus, { caixa: string; icone: string }> = {
  sucesso: { caixa: "border-success/30 bg-success/10", icone: "text-success" },
  perigo: { caixa: "border-destructive/30 bg-destructive/10", icone: "text-destructive" },
  alerta: { caixa: "border-warning/30 bg-warning/10", icone: "text-warning" },
  info: { caixa: "border-primary/30 bg-primary/10", icone: "text-primary" },
  neutro: { caixa: "border-border bg-muted", icone: "text-muted-foreground" },
};

interface Props {
  tom: TomStatus;
  icone?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

/**
 * Status com texto + ícone (a cor nunca é o único sinal). O texto usa a cor padrão,
 * com contraste garantido; a cor do status fica no ícone, na borda e no fundo suave.
 */
const StatusBadge: React.FC<Props> = ({ tom, icone: Icone, children, className }) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium text-foreground",
      TONS[tom].caixa,
      className,
    )}
  >
    {Icone && <Icone className={cn("h-3.5 w-3.5 shrink-0", TONS[tom].icone)} aria-hidden="true" />}
    {children}
  </span>
);

export default StatusBadge;

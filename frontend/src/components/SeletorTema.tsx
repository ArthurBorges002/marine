import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

/** Alterna entre modo claro (padrão) e escuro; a escolha fica salva no navegador. */
const SeletorTema: React.FC<{ comTexto?: boolean }> = ({ comTexto }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  const escuro = montado && resolvedTheme === "dark";
  const rotulo = escuro ? "Usar modo claro" : "Usar modo escuro";
  const Icone = escuro ? Sun : Moon;

  return (
    <Button
      variant="ghost"
      size={comTexto ? "sm" : "icon"}
      onClick={() => setTheme(escuro ? "light" : "dark")}
      aria-label={comTexto ? undefined : rotulo}
      title={rotulo}
      className={comTexto ? "w-full justify-start gap-3 px-3 text-muted-foreground" : "text-muted-foreground"}
    >
      <Icone className="h-4 w-4" aria-hidden="true" />
      {comTexto && <span>{escuro ? "Modo claro" : "Modo escuro"}</span>}
    </Button>
  );
};

export default SeletorTema;

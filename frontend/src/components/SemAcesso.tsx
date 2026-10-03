import React from "react";
import { Link } from "react-router-dom";
import { ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import EstadoVazio from "./EstadoVazio";

/** Tela exibida quando o perfil do usuário não tem acesso à página (em vez de esconder sem explicar). */
const SemAcesso: React.FC = () => (
  <Card className="shadow-card">
    <EstadoVazio
      icone={ShieldOff}
      titulo="Você não tem acesso a esta tela"
      descricao="O seu perfil não inclui esta permissão. Se precisar dela, peça ao administrador da sua empresa."
      acao={
        <Button asChild variant="outline">
          <Link to="/">Ir para o início</Link>
        </Button>
      }
    />
  </Card>
);

export default SemAcesso;

import React from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  /** Chave do catálogo de permissões (ex.: "rh.funcionarios.criar"). */
  permissao: string;
  children: React.ReactNode;
  /** O que mostrar sem a permissão (padrão: nada). */
  senao?: React.ReactNode;
}

/** Mostra o conteúdo só para quem tem a permissão. A API verifica de novo: isto é só a interface. */
const Pode: React.FC<Props> = ({ permissao, children, senao = null }) => {
  const { pode } = useAuth();
  return <>{pode(permissao) ? children : senao}</>;
};

export default Pode;

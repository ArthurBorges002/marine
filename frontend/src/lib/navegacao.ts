import { Building2, DollarSign, FolderOpen, Home, Settings, Users, Wrench, type LucideIcon } from "lucide-react";

export interface ItemMenu {
  nome: string;
  rota: string;
  icone: LucideIcon;
  /** Permissão do catálogo exigida (null = qualquer usuário da organização). */
  permissao: string | null;
}

/** Menu dos usuários de uma organização. Configurações fica sempre visível (Minha conta). */
export const menuOrganizacao: ItemMenu[] = [
  { nome: "Dashboard", rota: "/", icone: Home, permissao: "dashboard.ver" },
  { nome: "Funcionários", rota: "/funcionarios", icone: Users, permissao: "rh.funcionarios.ver" },
  { nome: "Equipamentos", rota: "/equipamentos", icone: Wrench, permissao: "operacional.equipamentos.ver" },
  { nome: "Projetos", rota: "/projetos", icone: FolderOpen, permissao: "contratos.projetos.ver" },
  { nome: "Finanças", rota: "/financas", icone: DollarSign, permissao: "financeiro.ver" },
  { nome: "Configurações", rota: "/configuracoes", icone: Settings, permissao: null },
];

/** Menu do administrador da plataforma (dono do SaaS). */
export const menuPlataforma: ItemMenu[] = [
  { nome: "Organizações", rota: "/plataforma/organizacoes", icone: Building2, permissao: null },
];

export const ROTA_PLATAFORMA = "/plataforma/organizacoes";

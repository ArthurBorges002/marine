import type { AcaoAuditoria } from "@/types";

export const NOMES_ACAO: Record<AcaoAuditoria, string> = {
  criado: "Criação",
  atualizado: "Alteração",
  excluido: "Exclusão",
  login: "Entrada no sistema",
  login_falhou: "Tentativa de entrada falhou",
};

/** Mesmas chaves de AuditoriaResource::ENTIDADES no backend. */
export const ENTIDADES: Record<string, string> = {
  funcionario: "Funcionário",
  certificacao: "Certificação",
  projeto: "Projeto",
  equipamento: "Equipamento",
  conta_pagar: "Conta a pagar",
  conta_receber: "Conta a receber",
  fluxo_caixa: "Fluxo de caixa",
  configuracao_cadastro: "Configuração de cadastro",
  papel_timbrado: "Papel timbrado",
  usuario: "Usuário",
  perfil: "Perfil",
  organizacao: "Organização",
};

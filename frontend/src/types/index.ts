// Formatos das entidades retornadas pela API.

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
  /** Dono do SaaS: administra organizações e não acessa dados de negócio. */
  administradorPlataforma: boolean;
  organizacao: { id: number; nome: string } | null;
  perfil: { id: number; nome: string; administrador: boolean } | null;
  /** Chaves do catálogo (ex.: "rh.funcionarios.ver"). */
  permissoes: string[];
  ultimoAcessoEm: string | null;
}

export interface Perfil {
  id: number;
  nome: string;
  descricao: string | null;
  /** Acesso total; não pode ser editado nem excluído. */
  administrador: boolean;
  permissoes: string[];
  usuarios: number;
}

export interface ModuloPermissoes {
  modulo: string;
  permissoes: { chave: string; descricao: string }[];
}

export type AcaoAuditoria = 'criado' | 'atualizado' | 'excluido' | 'login' | 'login_falhou';

export interface RegistroAuditoria {
  id: number;
  acao: AcaoAuditoria;
  entidade: string | null;
  entidadeNome: string | null;
  registroId: number | null;
  usuario: { id: number; nome: string } | null;
  antes: Record<string, unknown> | null;
  depois: Record<string, unknown> | null;
  ip: string | null;
  em: string;
}

export interface PaginaAuditoria {
  data: RegistroAuditoria[];
  pagina: number;
  ultimaPagina: number;
  total: number;
}

/** Cliente do SaaS (visto pela administração da plataforma). */
export interface Organizacao {
  id: number;
  nome: string;
  documento: string | null;
  status: 'ativa' | 'suspensa';
  plano: string | null;
  usuarios: number;
  criadaEm: string | null;
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string | null;
  telefone: string | null;
  email: string | null;
  endereco: string | null;
  funcao: string | null;
  dataAdmissao: string | null;
  status: 'ativo' | 'inativo';
  proximoExame?: string | null;
  certificacoes: string[];
}

export interface Equipamento {
  id: number;
  nome: string;
  tipo: string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  quantidade: number;
  status: 'disponivel' | 'em_uso' | 'manutencao' | 'inativo';
  proximaManutencao?: string | null;
  custoManutencao?: number | null;
  projetoAtual?: string | null;
}

export interface Projeto {
  id: number;
  nome: string;
  cliente: string;
  local: string;
  dataInicio: string;
  dataFim?: string | null;
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'cancelado';
  progresso: number;
  orcamento: number;
  gastoReal: number;
  responsavel: string | null;
}

export interface ContaReceber {
  id: number;
  cliente: string;
  valor: number;
  dataVencimento: string;
  status: 'pendente' | 'pago' | 'vencido';
  descricao: string;
  projeto?: string | null;
}

export interface ContaPagar {
  id: number;
  fornecedor: string;
  valor: number;
  dataVencimento: string;
  status: 'pendente' | 'pago' | 'vencido';
  descricao: string;
  categoria: string;
}

export interface FluxoCaixa {
  data: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface Financas {
  contasReceber: ContaReceber[];
  contasPagar: ContaPagar[];
  fluxoCaixa: FluxoCaixa[];
}

export interface Dashboard {
  estatisticas: {
    totalProjetos: number;
    projetosAtivos: number;
    equipamentosDisponiveis: number;
    equipamentosManutencao: number;
    funcionariosAtivos: number;
    totalReceitas: number;
    totalDespesas: number;
    saldoAtual: number;
    contasVencidas: number;
  };
  alertas: {
    valorContasVencidas: number;
    manutencoesProximas: number;
    examesProximos: number;
    diasAlertaManutencao: number;
    diasAlertaExame: number;
  };
  projetos: Projeto[];
}

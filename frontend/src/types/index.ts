// Formatos das entidades retornadas pela API.

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'usuario';
  /** Dono do SaaS: administra organizações e não acessa dados de negócio. */
  administradorPlataforma: boolean;
  organizacao: { id: number; nome: string } | null;
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

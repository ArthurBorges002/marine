// Formatos das entidades retornadas pela API.

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'admin' | 'usuario';
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

/** Item da listagem de orçamentos. */
export interface OrcamentoResumo {
  codigo: number;
  codigo_interno: string;
  nome_cliente: string;
  cidade: string | null;
  estado: string | null;
  info_complementar: string | null;
  valor_total: string;
  criado_em_data: string;
  validade: string | null;
  status: 'A' | 'E' | 'R';
}

export interface ModeloResumo {
  codigo: string;
  nome: string;
}

export interface TemplateCapa {
  id: number;
  nome_template_capa_arquivo: string;
  nome_template_capa: string;
  url: string;
}

export interface TemplateDocumento {
  id: number;
  template_doc_nome_arquivo: string;
  template_doc_nome: string;
  url: string;
}

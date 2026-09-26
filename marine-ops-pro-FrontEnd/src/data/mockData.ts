// Dados de teste pré-populados para o sistema de gestão de mergulho

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string; // Em produção seria hasheada
  tipo: 'admin' | 'usuario';
}

export interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  funcao: string;
  dataAdmissao: string;
  status: 'ativo' | 'inativo';
  proximoExame?: string;
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
  proximaManutencao?: string;
  custoManutencao?: number;
  projetoAtual?: string;
}

export interface Projeto {
  id: number;
  nome: string;
  cliente: string;
  local: string;
  dataInicio: string;
  dataFim?: string;
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'cancelado';
  progresso: number;
  orcamento: number;
  gastoReal: number;
  responsavel: string;
}

export interface Orcamento {
  id: number;
  numero: string;
  cliente: string;
  local: string;
  descricao: string;
  valor: number;
  data: string;
  status: 'aberto' | 'aprovado' | 'rejeitado';
  validade: string;
}

export interface ContaReceber {
  id: number;
  cliente: string;
  valor: number;
  dataVencimento: string;
  status: 'pendente' | 'pago' | 'vencido';
  descricao: string;
  projeto?: string;
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

// Dados de teste
export const mockUsuarios: Usuario[] = [
  {
    id: 1,
    nome: 'Admin Sistema',
    email: 'admin@mergulho.com',
    senha: 'admin123', // Em produção: hash
    tipo: 'admin'
  },
  {
    id: 2,
    nome: 'João Silva',
    email: 'joao@mergulho.com',
    senha: 'user123', // Em produção: hash
    tipo: 'usuario'
  }
];

export const mockFuncionarios: Funcionario[] = [
  {
    id: 1,
    nome: 'Carlos Eduardo Santos',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-1234',
    email: 'carlos@mergulho.com',
    endereco: 'Rua das Águas, 123 - Santos/SP',
    funcao: 'Mergulhador Sênior',
    dataAdmissao: '2022-03-15',
    status: 'ativo',
    proximoExame: '2024-06-15',
    certificacoes: ['PADI Advanced', 'Soldador Subaquático', 'Inspeção Visual']
  },
  {
    id: 2,
    nome: 'Marina Costa',
    cpf: '987.654.321-00',
    telefone: '(11) 98888-5678',
    email: 'marina@mergulho.com',
    endereco: 'Av. Oceânica, 456 - Guarujá/SP',
    funcao: 'Supervisora de Mergulho',
    dataAdmissao: '2021-08-20',
    status: 'ativo',
    proximoExame: '2024-04-10',
    certificacoes: ['PADI Instructor', 'Mergulho Técnico', 'Primeiros Socorros']
  },
  {
    id: 3,
    nome: 'Roberto Ferreira',
    cpf: '456.789.123-00',
    telefone: '(11) 97777-9012',
    email: 'roberto@mergulho.com',
    endereco: 'Rua do Porto, 789 - São Vicente/SP',
    funcao: 'Técnico em Equipamentos',
    dataAdmissao: '2023-01-10',
    status: 'ativo',
    certificacoes: ['Manutenção de Compressores', 'Cilindros de Ar']
  }
];

export const mockEquipamentos: Equipamento[] = [
  {
    id: 1,
    nome: 'Cilindro de Ar 12L',
    tipo: 'Respiração',
    marca: 'Luxfer',
    modelo: 'L12X',
    numeroSerie: 'LX001234',
    quantidade: 15,
    status: 'disponivel',
    proximaManutencao: '2024-05-15',
    custoManutencao: 150
  },
  {
    id: 2,
    nome: 'Regulador Completo',
    tipo: 'Respiração',
    marca: 'Scubapro',
    modelo: 'MK25/S600',
    numeroSerie: 'SP567890',
    quantidade: 8,
    status: 'em_uso',
    projetoAtual: 'Inspeção Pier Santos',
    proximaManutencao: '2024-07-20',
    custoManutencao: 300
  },
  {
    id: 3,
    nome: 'Máquina de Solda Subaquática',
    tipo: 'Ferramenta',
    marca: 'Broco',
    modelo: 'BR-22',
    numeroSerie: 'BR445566',
    quantidade: 2,
    status: 'manutencao',
    proximaManutencao: '2024-03-30',
    custoManutencao: 1200
  },
  {
    id: 4,
    nome: 'Compressor de Ar',
    tipo: 'Suporte',
    marca: 'Bauer',
    modelo: 'Junior II',
    numeroSerie: 'BA789012',
    quantidade: 1,
    status: 'disponivel',
    proximaManutencao: '2024-08-10',
    custoManutencao: 800
  }
];

export const mockProjetos: Projeto[] = [
  {
    id: 1,
    nome: 'Inspeção Pier Santos',
    cliente: 'Porto de Santos',
    local: 'Santos/SP',
    dataInicio: '2024-02-01',
    status: 'em_andamento',
    progresso: 65,
    orcamento: 85000,
    gastoReal: 52000,
    responsavel: 'Marina Costa'
  },
  {
    id: 2,
    nome: 'Soldas Plataforma P-51',
    cliente: 'Petrobras',
    local: 'Bacia de Santos',
    dataInicio: '2024-01-15',
    dataFim: '2024-03-20',
    status: 'concluido',
    progresso: 100,
    orcamento: 150000,
    gastoReal: 142000,
    responsavel: 'Carlos Eduardo Santos'
  },
  {
    id: 3,
    nome: 'Manutenção Casco Navio',
    cliente: 'Vale Shipping',
    local: 'Rio de Janeiro/RJ',
    dataInicio: '2024-03-01',
    status: 'planejamento',
    progresso: 15,
    orcamento: 75000,
    gastoReal: 8000,
    responsavel: 'Marina Costa'
  }
];

export const mockOrcamentos: Orcamento[] = [
  {
    id: 1,
    numero: 'ORC-2024-001',
    cliente: 'Marinha Mercante LTDA',
    local: 'Vitória/ES',
    descricao: 'Inspeção e limpeza de casco de embarcação',
    valor: 45000,
    data: '2024-02-15',
    status: 'aprovado',
    validade: '2024-04-15'
  },
  {
    id: 2,
    numero: 'ORC-2024-002',
    cliente: 'Estaleiro Atlântico',
    local: 'Recife/PE',
    descricao: 'Soldas subaquáticas em estrutura portuária',
    valor: 120000,
    data: '2024-03-01',
    status: 'aberto',
    validade: '2024-05-01'
  },
  {
    id: 3,
    numero: 'ORC-2024-003',
    cliente: 'Transpetro',
    local: 'Ilha D\'Água/RJ',
    descricao: 'Manutenção preventiva em terminal marítimo',
    valor: 95000,
    data: '2024-03-10',
    status: 'rejeitado',
    validade: '2024-05-10'
  }
];

export const mockContasReceber: ContaReceber[] = [
  {
    id: 1,
    cliente: 'Porto de Santos',
    valor: 25000,
    dataVencimento: '2024-04-15',
    status: 'pendente',
    descricao: 'Parcela 1/3 - Inspeção Pier Santos',
    projeto: 'Inspeção Pier Santos'
  },
  {
    id: 2,
    cliente: 'Petrobras',
    valor: 75000,
    dataVencimento: '2024-03-25',
    status: 'pago',
    descricao: 'Pagamento final - Soldas Plataforma P-51',
    projeto: 'Soldas Plataforma P-51'
  },
  {
    id: 3,
    cliente: 'Vale Shipping',
    valor: 15000,
    dataVencimento: '2024-02-20',
    status: 'vencido',
    descricao: 'Sinal - Manutenção Casco Navio',
    projeto: 'Manutenção Casco Navio'
  }
];

export const mockContasPagar: ContaPagar[] = [
  {
    id: 1,
    fornecedor: 'Luxfer Brasil',
    valor: 8500,
    dataVencimento: '2024-04-10',
    status: 'pendente',
    descricao: 'Manutenção cilindros de ar',
    categoria: 'Equipamentos'
  },
  {
    id: 2,
    fornecedor: 'Folha de Pagamento',
    valor: 35000,
    dataVencimento: '2024-03-30',
    status: 'pago',
    descricao: 'Salários março 2024',
    categoria: 'Pessoal'
  },
  {
    id: 3,
    fornecedor: 'Combustível Marítimo',
    valor: 12000,
    dataVencimento: '2024-04-05',
    status: 'pendente',
    descricao: 'Abastecimento embarcações',
    categoria: 'Operacional'
  }
];

export const mockFluxoCaixa: FluxoCaixa[] = [
  { data: '2024-01', entradas: 120000, saidas: 85000, saldo: 35000 },
  { data: '2024-02', entradas: 95000, saidas: 72000, saldo: 58000 },
  { data: '2024-03', entradas: 150000, saidas: 95000, saldo: 113000 },
  { data: '2024-04', entradas: 85000, saidas: 68000, saldo: 130000 },
];

// Funções utilitárias para estatísticas
export const getStatistics = () => {
  const totalProjetos = mockProjetos.length;
  const projetosAtivos = mockProjetos.filter(p => p.status === 'em_andamento').length;
  const equipamentosDisponiveis = mockEquipamentos.reduce((acc, eq) => 
    acc + (eq.status === 'disponivel' ? eq.quantidade : 0), 0
  );
  const equipamentosManutencao = mockEquipamentos.filter(eq => eq.status === 'manutencao').length;
  const funcionariosAtivos = mockFuncionarios.filter(f => f.status === 'ativo').length;
  const totalReceitas = mockContasReceber.reduce((acc, c) => acc + c.valor, 0);
  const totalDespesas = mockContasPagar.reduce((acc, c) => acc + c.valor, 0);
  const contasVencidas = mockContasReceber.filter(c => c.status === 'vencido').length;

  return {
    totalProjetos,
    projetosAtivos,
    equipamentosDisponiveis,
    equipamentosManutencao,
    funcionariosAtivos,
    totalReceitas,
    totalDespesas,
    saldoAtual: totalReceitas - totalDespesas,
    contasVencidas
  };
};
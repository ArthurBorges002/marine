import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import QueryState from '@/components/QueryState';
import { api } from '@/lib/api';
import type { Projeto } from '@/types';
import { 
  FolderOpen, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Calendar,
  MapPin,
  User,
  DollarSign,
  TrendingUp,
  Clock
} from 'lucide-react';

const Projetos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: projetos = [], isLoading, error } = useQuery({
    queryKey: ['projetos'],
    queryFn: () => api.get<Projeto[]>('/projetos'),
  });

  const filteredProjetos = projetos.filter(proj =>
    proj.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.local.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'concluido': return 'bg-success text-success-foreground';
      case 'em_andamento': return 'bg-primary text-primary-foreground';
      case 'planejamento': return 'bg-warning text-warning-foreground';
      case 'cancelado': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'concluido': return 'Concluído';
      case 'em_andamento': return 'Em Andamento';
      case 'planejamento': return 'Planejamento';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getProgressColor = (progresso: number) => {
    if (progresso >= 80) return 'text-success';
    if (progresso >= 50) return 'text-primary';
    if (progresso >= 25) return 'text-warning';
    return 'text-muted-foreground';
  };

  const calcularVariacaoOrcamento = (orcamento: number, gastoReal: number) => {
    const variacao = ((gastoReal - orcamento) / orcamento) * 100;
    return {
      valor: Math.abs(variacao),
      tipo: variacao > 0 ? 'acima' : 'abaixo'
    };
  };

  const estatisticas = {
    total: projetos.length,
    emAndamento: projetos.filter(p => p.status === 'em_andamento').length,
    concluidos: projetos.filter(p => p.status === 'concluido').length,
    planejamento: projetos.filter(p => p.status === 'planejamento').length,
    cancelados: projetos.filter(p => p.status === 'cancelado').length,
    orcamentoTotal: projetos.reduce((acc, p) => acc + p.orcamento, 0),
    gastoTotal: projetos.reduce((acc, p) => acc + p.gastoReal, 0)
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projetos</h1>
          <p className="text-muted-foreground">Gerencie projetos de mergulho e operações</p>
        </div>
        
        <Button className="bg-gradient-ocean border-0 shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{estatisticas.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{estatisticas.emAndamento}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{estatisticas.concluidos}</p>
              <p className="text-sm text-muted-foreground">Concluídos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{estatisticas.planejamento}</p>
              <p className="text-sm text-muted-foreground">Planejamento</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-xl font-bold text-primary">
                {Math.round(((estatisticas.gastoTotal / estatisticas.orcamentoTotal) * 100))}%
              </p>
              <p className="text-sm text-muted-foreground">Execução Orçamentária</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Financeiro */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Resumo Financeiro dos Projetos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Orçamento Total</p>
              <p className="text-2xl font-bold text-primary">
                R$ {(estatisticas.orcamentoTotal / 1000).toFixed(0)}k
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Gasto Real</p>
              <p className="text-2xl font-bold text-primary">
                R$ {(estatisticas.gastoTotal / 1000).toFixed(0)}k
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-success font-bold">±</span>
              </div>
              <p className="text-sm text-muted-foreground">Variação</p>
              <p className={`text-2xl font-bold ${
                estatisticas.gastoTotal < estatisticas.orcamentoTotal ? 'text-success' : 'text-destructive'
              }`}>
                {estatisticas.gastoTotal < estatisticas.orcamentoTotal ? '-' : '+'}
                R$ {Math.abs((estatisticas.orcamentoTotal - estatisticas.gastoTotal) / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Busca */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Busca e Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome, cliente ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Status
              </Button>
              <Button variant="outline" size="sm">
                Cliente
              </Button>
              <Button variant="outline" size="sm">
                Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <QueryState isLoading={isLoading} error={error} />

      {/* Lista de Projetos */}
      <div className="grid gap-4">
        {filteredProjetos.map((projeto) => {
          const variacao = calcularVariacaoOrcamento(projeto.orcamento, projeto.gastoReal);
          
          return (
            <Card key={projeto.id} className="shadow-card hover:shadow-ocean transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Ícone e informações básicas */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gradient-ocean rounded-lg flex items-center justify-center">
                      <FolderOpen className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">
                            {projeto.nome}
                          </h3>
                          <p className="text-muted-foreground">{projeto.cliente}</p>
                        </div>
                        <Badge className={getStatusColor(projeto.status)}>
                          {getStatusLabel(projeto.status)}
                        </Badge>
                      </div>

                      {/* Progresso */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Progresso</span>
                          <span className={`text-sm font-medium ${getProgressColor(projeto.progresso)}`}>
                            {projeto.progresso}%
                          </span>
                        </div>
                        <Progress value={projeto.progresso} className="h-2" />
                      </div>
                    </div>
                  </div>

                  {/* Informações detalhadas */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Local:</span>
                        <span className="font-medium">{projeto.local}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Responsável:</span>
                        <span className="font-medium">{projeto.responsavel}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Início:</span>
                        <span className="font-medium">
                          {new Date(projeto.dataInicio).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      {projeto.dataFim && (
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Conclusão:</span>
                          <span className="font-medium">
                            {new Date(projeto.dataFim).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Orçamento:</span>
                          <span className="font-bold text-primary">
                            R$ {projeto.orcamento.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Gasto Real:</span>
                          <span className="font-bold text-primary">
                            R$ {projeto.gastoReal.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Variação:</span>
                          <span className={`font-bold ${
                            variacao.tipo === 'abaixo' ? 'text-success' : 'text-destructive'
                          }`}>
                            {variacao.tipo === 'abaixo' ? '-' : '+'}
                            {variacao.valor.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Saldo:</span>
                          <span className={`font-bold ${
                            projeto.orcamento > projeto.gastoReal ? 'text-success' : 'text-destructive'
                          }`}>
                            R$ {Math.abs(projeto.orcamento - projeto.gastoReal).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                      <Eye className="w-4 h-4 mr-2" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Projetos;
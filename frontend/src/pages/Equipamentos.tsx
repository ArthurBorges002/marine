import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import QueryState from '@/components/QueryState';
import { api } from '@/lib/api';
import type { Equipamento } from '@/types';
import { 
  Wrench, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  AlertTriangle,
  Calendar,
  Package,
  Settings,
  FileText,
  DollarSign
} from 'lucide-react';

const Equipamentos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: equipamentos = [], isLoading, error } = useQuery({
    queryKey: ['equipamentos'],
    queryFn: () => api.get<Equipamento[]>('/equipamentos'),
  });

  const filteredEquipamentos = equipamentos.filter(eq =>
    eq.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eq.marca.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-success text-success-foreground';
      case 'em_uso': return 'bg-primary text-primary-foreground';
      case 'manutencao': return 'bg-warning text-warning-foreground';
      case 'inativo': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'em_uso': return 'Em Uso';
      case 'manutencao': return 'Manutenção';
      case 'inativo': return 'Inativo';
      default: return status;
    }
  };

  const isManutencaoProxima = (dataManutencao?: string) => {
    if (!dataManutencao) return false;
    const hoje = new Date();
    const manutencao = new Date(dataManutencao);
    const diasRestantes = Math.ceil((manutencao.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    return diasRestantes <= 15 && diasRestantes > 0;
  };

  const estatisticas = {
    total: equipamentos.length,
    disponivel: equipamentos.filter(e => e.status === 'disponivel').length,
    emUso: equipamentos.filter(e => e.status === 'em_uso').length,
    manutencao: equipamentos.filter(e => e.status === 'manutencao').length,
    inativo: equipamentos.filter(e => e.status === 'inativo').length,
    proximaManutencao: equipamentos.filter(e => isManutencaoProxima(e.proximaManutencao)).length
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Equipamentos</h1>
          <p className="text-muted-foreground">Controle de equipamentos e manutenções</p>
        </div>
        
        <Button className="bg-gradient-ocean border-0 shadow-glow">
          <Plus className="w-4 h-4 mr-2" />
          Novo Equipamento
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
              <p className="text-2xl font-bold text-success">{estatisticas.disponivel}</p>
              <p className="text-sm text-muted-foreground">Disponível</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{estatisticas.emUso}</p>
              <p className="text-sm text-muted-foreground">Em Uso</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{estatisticas.manutencao}</p>
              <p className="text-sm text-muted-foreground">Manutenção</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">{estatisticas.inativo}</p>
              <p className="text-sm text-muted-foreground">Inativo</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{estatisticas.proximaManutencao}</p>
              <p className="text-sm text-muted-foreground">Manutenção Próxima</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
                placeholder="Buscar por nome, tipo ou marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Tipo
              </Button>
              <Button variant="outline" size="sm">
                Status
              </Button>
              <Button variant="outline" size="sm">
                Manutenção
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <QueryState isLoading={isLoading} error={error} />

      {/* Lista de Equipamentos */}
      <div className="grid gap-4">
        {filteredEquipamentos.map((equipamento) => (
          <Card key={equipamento.id} className="shadow-card hover:shadow-ocean transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Ícone e informações básicas */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-ocean rounded-lg flex items-center justify-center">
                    <Wrench className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {equipamento.nome}
                        </h3>
                        <p className="text-muted-foreground">{equipamento.tipo} - {equipamento.marca}</p>
                      </div>
                      <Badge className={getStatusColor(equipamento.status)}>
                        {getStatusLabel(equipamento.status)}
                      </Badge>
                    </div>

                    {/* Alertas de manutenção */}
                    {isManutencaoProxima(equipamento.proximaManutencao) && (
                      <div className="mb-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-center gap-2 text-warning">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Manutenção próxima</span>
                        </div>
                      </div>
                    )}
                    
                    {equipamento.status === 'manutencao' && (
                      <div className="mb-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-center gap-2 text-warning">
                          <Settings className="w-4 h-4" />
                          <span className="text-sm font-medium">Em manutenção</span>
                        </div>
                      </div>
                    )}

                    {equipamento.projetoAtual && (
                      <div className="mb-3 p-2 bg-primary/10 border border-primary/20 rounded-lg">
                        <div className="flex items-center gap-2 text-primary">
                          <Package className="w-4 h-4" />
                          <span className="text-sm font-medium">Projeto: {equipamento.projetoAtual}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações detalhadas */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Modelo:</span>
                      <span className="ml-2 font-medium">{equipamento.modelo}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Número de Série:</span>
                      <span className="ml-2 font-medium">{equipamento.numeroSerie}</span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <span className="ml-2 font-medium">{equipamento.quantidade} unidades</span>
                    </div>

                    {equipamento.custoManutencao && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Custo Manutenção:</span>
                        <span className="ml-2 font-medium text-primary">
                          R$ {equipamento.custoManutencao.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    {equipamento.proximaManutencao && (
                      <div className="text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Próxima Manutenção:</span>
                        </div>
                        <span className="ml-6 font-medium">
                          {new Date(equipamento.proximaManutencao).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}

                    {/* Barra de disponibilidade baseada no status */}
                    <div className="text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Disponibilidade:</span>
                      </div>
                      <Progress 
                        value={equipamento.status === 'disponivel' ? 100 : 
                               equipamento.status === 'em_uso' ? 50 : 
                               equipamento.status === 'manutencao' ? 25 : 0} 
                        className="ml-6"
                      />
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
                  <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                    <FileText className="w-4 h-4 mr-2" />
                    Docs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card de Resumo de Custos */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Resumo de Custos de Manutenção
          </CardTitle>
          <CardDescription>
            Projeção de custos baseada nas manutenções programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Próximos 30 dias</p>
              <p className="text-2xl font-bold text-warning">
                R$ {equipamentos
                  .filter(e => isManutencaoProxima(e.proximaManutencao))
                  .reduce((acc, e) => acc + (e.custoManutencao || 0), 0)
                  .toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Em manutenção atual</p>
              <p className="text-2xl font-bold text-destructive">
                R$ {equipamentos
                  .filter(e => e.status === 'manutencao')
                  .reduce((acc, e) => acc + (e.custoManutencao || 0), 0)
                  .toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Total anual estimado</p>
              <p className="text-2xl font-bold text-primary">
                R$ {(equipamentos
                  .reduce((acc, e) => acc + (e.custoManutencao || 0), 0) * 2)
                  .toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Equipamentos;
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import StatCard from './StatCard';
import QueryState from './QueryState';
import { api } from '@/lib/api';
import type { Dashboard as DashboardData } from '@/types';
import {
  FolderOpen,
  Users,
  Wrench,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Activity
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const [selectedDashboard, setSelectedDashboard] = useState('global');
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api.get<DashboardData>('/dashboard'),
  });

  if (!data) return <QueryState isLoading={isLoading} error={error} />;

  const { estatisticas: stats, alertas, projetos } = data;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral das operações de mergulho</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedDashboard} onValueChange={setSelectedDashboard}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Selecionar Dashboard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Dashboard Global</SelectItem>
              {projetos.map((projeto) => (
                <SelectItem key={projeto.id} value={`projeto${projeto.id}`}>{projeto.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      {/* Cards Estatísticos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Projetos Ativos"
          value={stats.projetosAtivos}
          icon={FolderOpen}
          description={`Total: ${stats.totalProjetos}`}
          color="default"
        />
        
        <StatCard
          title="Funcionários Ativos"
          value={stats.funcionariosAtivos}
          icon={Users}
          description="Disponíveis para operação"
          color="success"
        />
        
        <StatCard
          title="Equipamentos Disponíveis"
          value={stats.equipamentosDisponiveis}
          icon={Wrench}
          description={`${stats.equipamentosManutencao} em manutenção`}
          color={stats.equipamentosManutencao > 0 ? 'warning' : 'success'}
        />
        
        <StatCard
          title="Saldo Atual"
          value={`R$ ${(stats.saldoAtual / 1000).toFixed(0)}k`}
          icon={DollarSign}
          description={stats.contasVencidas > 0 ? `${stats.contasVencidas} contas vencidas` : 'Em dia'}
          color={stats.contasVencidas > 0 ? 'destructive' : 'success'}
        />
      </div>

      {/* Gráficos Simplificados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Projetos */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Projetos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projetos.slice(0, 3).map((projeto) => (
                <div key={projeto.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{projeto.nome}</p>
                    <p className="text-sm text-muted-foreground">{projeto.cliente}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{projeto.progresso}%</p>
                    <p className="text-xs text-muted-foreground">
                      R$ {(projeto.gastoReal / 1000).toFixed(0)}k / {(projeto.orcamento / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Alertas e Pendências
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border border-destructive/20 bg-destructive/5 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-medium text-destructive">Contas Vencidas</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {stats.contasVencidas} conta(s) em atraso - R$ {alertas.valorContasVencidas.toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div className="p-3 border border-warning/20 bg-warning/5 rounded-lg">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">Manutenção Preventiva</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {alertas.manutencoesProximas} equipamento(s) com manutenção vencendo em {alertas.diasAlertaManutencao} dias
              </p>
            </div>
            
            <div className="p-3 border border-warning/20 bg-warning/5 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-warning" />
                <span className="font-medium text-warning">Exames Médicos</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {alertas.examesProximos} funcionário(s) com exames vencendo em {alertas.diasAlertaExame} dias
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import QueryState from '@/components/QueryState';
import { api } from '@/lib/api';
import type { Financas as FinancasData } from '@/types';
import { 
  DollarSign, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  FileText,
  CreditCard,
  Banknote
} from 'lucide-react';

const Financas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, isLoading, error } = useQuery({
    queryKey: ['financas'],
    queryFn: () => api.get<FinancasData>('/financas'),
  });
  const contasReceber = data?.contasReceber ?? [];
  const contasPagar = data?.contasPagar ?? [];
  const fluxoCaixa = data?.fluxoCaixa ?? [];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pago': return 'bg-success text-success-foreground';
      case 'pendente': return 'bg-warning text-warning-foreground';
      case 'vencido': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pago': return 'Pago';
      case 'pendente': return 'Pendente';
      case 'vencido': return 'Vencido';
      default: return status;
    }
  };

  // Estatísticas
  const totalReceber = contasReceber.reduce((acc, c) => acc + c.valor, 0);
  const totalPagar = contasPagar.reduce((acc, c) => acc + c.valor, 0);
  const contasReceberPendentes = contasReceber.filter(c => c.status === 'pendente').length;
  const contasPagarPendentes = contasPagar.filter(c => c.status === 'pendente').length;
  const contasVencidas = [...contasReceber, ...contasPagar].filter(c => c.status === 'vencido').length;

  if (!data) return <QueryState isLoading={isLoading} error={error} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Finanças</h1>
          <p className="text-muted-foreground">Controle financeiro e fluxo de caixa</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Relatórios
          </Button>
          <Button className="bg-gradient-ocean border-0 shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Nova Conta
          </Button>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">A Receber</p>
                <p className="text-2xl font-bold text-success">
                  R$ {(totalReceber / 1000).toFixed(0)}k
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">A Pagar</p>
                <p className="text-2xl font-bold text-destructive">
                  R$ {(totalPagar / 1000).toFixed(0)}k
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${
                  totalReceber > totalPagar ? 'text-success' : 'text-destructive'
                }`}>
                  R$ {Math.abs((totalReceber - totalPagar) / 1000).toFixed(0)}k
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold text-warning">
                  {contasReceberPendentes + contasPagarPendentes}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vencidas</p>
                <p className="text-2xl font-bold text-destructive">{contasVencidas}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Visual Simples */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Fluxo de Caixa Mensal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {fluxoCaixa.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <span className="font-medium">{item.data}</span>
                  <div className="text-right">
                    <p className={`font-bold ${item.saldo > 0 ? 'text-success' : 'text-destructive'}`}>
                      R$ {(item.saldo / 1000).toFixed(0)}k
                    </p>
                    <p className="text-xs text-muted-foreground">
                      +{(item.entradas / 1000).toFixed(0)}k / -{(item.saidas / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Resumo por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span>Receitas Totais</span>
                <span className="font-bold text-success">R$ {(totalReceber / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <span>Despesas Totais</span>
                <span className="font-bold text-destructive">R$ {(totalPagar / 1000).toFixed(0)}k</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg bg-primary/5">
                <span className="font-medium">Saldo Líquido</span>
                <span className={`font-bold ${totalReceber > totalPagar ? 'text-success' : 'text-destructive'}`}>
                  R$ {(Math.abs(totalReceber - totalPagar) / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para Contas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Gestão de Contas</CardTitle>
          <CardDescription>
            Controle de contas a receber e a pagar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="receber" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="receber" className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Contas a Receber
              </TabsTrigger>
              <TabsTrigger value="pagar" className="flex items-center gap-2">
                <Banknote className="w-4 h-4" />
                Contas a Pagar
              </TabsTrigger>
            </TabsList>

            {/* Contas a Receber */}
            <TabsContent value="receber" className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Buscar contas a receber..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>

              <div className="space-y-3">
                {contasReceber
                  .filter(conta => conta.cliente.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((conta) => (
                  <Card key={conta.id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground">{conta.cliente}</h4>
                            <Badge className={getStatusColor(conta.status)}>
                              {getStatusLabel(conta.status)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{conta.descricao}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              Vencimento: {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
                            </span>
                            {conta.projeto && (
                              <span className="text-muted-foreground">
                                Projeto: {conta.projeto}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-success">
                            R$ {conta.valor.toLocaleString('pt-BR')}
                          </p>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Contas a Pagar */}
            <TabsContent value="pagar" className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Buscar contas a pagar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Filtros
                </Button>
              </div>

              <div className="space-y-3">
                {contasPagar
                  .filter(conta => conta.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((conta) => (
                  <Card key={conta.id} className="border border-border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-foreground">{conta.fornecedor}</h4>
                            <Badge className={getStatusColor(conta.status)}>
                              {getStatusLabel(conta.status)}
                            </Badge>
                            <Badge variant="outline">{conta.categoria}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{conta.descricao}</p>
                          <div className="text-sm text-muted-foreground">
                            Vencimento: {new Date(conta.dataVencimento).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-destructive">
                            R$ {conta.valor.toLocaleString('pt-BR')}
                          </p>
                          <div className="flex gap-1 mt-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financas;
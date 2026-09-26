import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { mockFuncionarios } from '@/data/mockData';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  AlertTriangle,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  Award,
  FileEdit
} from 'lucide-react';

const Funcionarios: React.FC = () => {

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredFuncionarios = mockFuncionarios.filter(func =>
    func.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.funcao.toLowerCase().includes(searchTerm.toLowerCase()) ||
    func.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    return status === 'ativo' 
      ? 'bg-success text-success-foreground' 
      : 'bg-muted text-muted-foreground';
  };

  const isExameProximo = (dataExame?: string) => {
    if (!dataExame) return false;
    const hoje = new Date();
    const exame = new Date(dataExame);
    const diasRestantes = Math.ceil((exame.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
    return diasRestantes <= 30 && diasRestantes > 0;
  };

  const isExameVencido = (dataExame?: string) => {
    if (!dataExame) return false;
    const hoje = new Date();
    const exame = new Date(dataExame);
    return exame < hoje;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funcionários</h1>
          <p className="text-muted-foreground">Gerencie a equipe e acompanhe certificações</p>
        </div>
        
        <Button 
          className="bg-gradient-ocean border-0 shadow-glow"
          onClick={() => {
            navigate("/Novo_Funcionario?acao=criar");
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Funcionário
        </Button>
      </div>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{mockFuncionarios.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-2xl font-bold text-success">
                  {mockFuncionarios.filter(f => f.status === 'ativo').length}
                </p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <span className="text-success font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exames Próximos</p>
                <p className="text-2xl font-bold text-warning">
                  {mockFuncionarios.filter(f => isExameProximo(f.proximoExame)).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Exames Vencidos</p>
                <p className="text-2xl font-bold text-destructive">
                  {mockFuncionarios.filter(f => isExameVencido(f.proximoExame)).length}
                </p>
              </div>
              <div className="w-8 h-8 bg-destructive/20 rounded-full flex items-center justify-center">
                <span className="text-destructive font-bold">!</span>
              </div>
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
                placeholder="Buscar por nome, função ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Função
              </Button>
              <Button variant="outline" size="sm">
                Status
              </Button>
              <Button variant="outline" size="sm">
                Exames
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Funcionários */}
      <div className="grid gap-4">
        {filteredFuncionarios.map((funcionario) => (
          <Card key={funcionario.id} className="shadow-card hover:shadow-ocean transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Avatar e informações básicas */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-ocean rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {funcionario.nome.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {funcionario.nome}
                        </h3>
                        <p className="text-muted-foreground">{funcionario.funcao}</p>
                      </div>
                      <Badge className={getStatusColor(funcionario.status)}>
                        {funcionario.status === 'ativo' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>

                    {/* Alertas de exame */}
                    {isExameVencido(funcionario.proximoExame) && (
                      <div className="mb-3 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Exame médico vencido</span>
                        </div>
                      </div>
                    )}
                    
                    {isExameProximo(funcionario.proximoExame) && !isExameVencido(funcionario.proximoExame) && (
                      <div className="mb-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
                        <div className="flex items-center gap-2 text-warning">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Exame médico próximo do vencimento</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações detalhadas */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{funcionario.telefone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{funcionario.email}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Admitido em: {new Date(funcionario.dataAdmissao).toLocaleDateString('pt-BR')}</span>
                    </div>

                    {funcionario.proximoExame && (
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-muted-foreground" />
                        <span>Próximo exame: {new Date(funcionario.proximoExame).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Award className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">Certificações:</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {funcionario.certificacoes.map((cert, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
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
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1 lg:flex-none"
                    onClick={() => navigate("/Novo_Funcionario?acao=editar&codigo=1")}>
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 lg:flex-none">
                    <FileEdit className="w-4 h-4 mr-2" />
                    Docs
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Funcionarios;
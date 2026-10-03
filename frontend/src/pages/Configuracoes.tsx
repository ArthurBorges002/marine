import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Shield, 
  Database,
  Mail,
  Bell,
  Palette,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { Navigate, useNavigate } from "react-router-dom";

const Configuracoes: React.FC = () => {
  
  const navegate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Gerencie as configurações do sistema</p>
        </div>
        
        <Button variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Sincronizar
        </Button>
      </div>

      {/* Grid de Configurações */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Perfil do Usuário */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Perfil do Usuário
            </CardTitle>
            <CardDescription>
              Gerencie informações da conta e preferências
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Informações Pessoais</p>
                <p className="text-sm text-muted-foreground">Nome, email e dados de contato</p>
              </div>
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Alterar Senha</p>
                <p className="text-sm text-muted-foreground">Atualize sua senha de acesso</p>
              </div>
              <Button variant="outline" size="sm">
                Alterar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Preferências</p>
                <p className="text-sm text-muted-foreground">Idioma, fuso horário, formato de data</p>
              </div>
              <Button variant="outline" size="sm">
                Configurar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança e acesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Autenticação em Duas Etapas</p>
                <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
              </div>
              <Badge variant="outline">Desabilitado</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Sessões Ativas</p>
                <p className="text-sm text-muted-foreground">Gerencie dispositivos conectados</p>
              </div>
              <Button variant="outline" size="sm">
                Ver Sessões
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Log de Auditoria</p>
                <p className="text-sm text-muted-foreground">Histórico de ações no sistema</p>
              </div>
              <Button variant="outline" size="sm">
                Visualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notificações
            </CardTitle>
            <CardDescription>
              Configure alertas e notificações do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Alertas de Manutenção</p>
                <p className="text-sm text-muted-foreground">Equipamentos próximos da manutenção</p>
              </div>
              <Badge className="bg-success text-success-foreground">Ativo</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Exames Médicos</p>
                <p className="text-sm text-muted-foreground">Funcionários com exames vencendo</p>
              </div>
              <Badge className="bg-success text-success-foreground">Ativo</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Contas a Vencer</p>
                <p className="text-sm text-muted-foreground">Lembretes de pagamentos</p>
              </div>
              <Badge className="bg-success text-success-foreground">Ativo</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">Configurações do servidor SMTP</p>
              </div>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Configurar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sistema */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" />
              Sistema
            </CardTitle>
            <CardDescription>
              Configurações gerais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Personalizar Cadastros</p>
                <p className="text-sm text-muted-foreground">Personalizar Campos Em Telas De Cadastros</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {navegate("/configuracoes_cadastros"); scrollTo({top : 0})}}>
                Personalizar
              </Button>
            </div>
          
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Backup dos Dados</p>
                <p className="text-sm text-muted-foreground">Exportar dados do sistema</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Backup
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Importar Dados</p>
                <p className="text-sm text-muted-foreground">Restaurar ou importar informações</p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Logs do Sistema</p>
                <p className="text-sm text-muted-foreground">Visualizar logs de erro e atividade</p>
              </div>
              <Button variant="outline" size="sm">
                Visualizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Aparência
            </CardTitle>
            <CardDescription>
              Personalize a interface do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Tema</p>
                <p className="text-sm text-muted-foreground">Modo claro ou escuro</p>
              </div>
              <Badge variant="outline">Claro</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Layout do Dashboard</p>
                <p className="text-sm text-muted-foreground">Organize os cartões principais</p>
              </div>
              <Button variant="outline" size="sm">
                Personalizar
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Densidade da Interface</p>
                <p className="text-sm text-muted-foreground">Espaçamento entre elementos</p>
              </div>
              <Badge variant="outline">Normal</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Informações do Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Versão</p>
              <p className="text-lg font-bold">v2.1.0</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Última Atualização</p>
              <p className="text-lg font-bold">15/03/2024</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Usuários Ativos</p>
              <p className="text-lg font-bold">2</p>
            </div>
            
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="bg-success text-success-foreground">Online</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Configuracoes;
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Waves, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    // Simular delay da autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (login(email, senha)) {
      // Redirecionamento será tratado pelo componente pai
    } else {
      setErro('Email ou senha incorretos');
    }
    
    setIsLoading(false);
  };

  const preencherAdmin = () => {
    setEmail('admin@mergulho.com');
    setSenha('admin123');
  };

  const preencherUsuario = () => {
    setEmail('joao@mergulho.com');
    setSenha('user123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-ocean p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Logo e Título */}
        <div className="text-center text-white space-y-4">
          <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Waves className="w-8 h-8 text-white animate-wave" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Sistema de Mergulho</h1>
            <p className="text-white/80">Gestão Profissional de Operações</p>
          </div>
        </div>

        {/* Formulário */}
        <Card className="shadow-ocean">
          <CardHeader>
            <CardTitle>Entrar no Sistema</CardTitle>
            <CardDescription>
              Faça login para acessar o sistema de gestão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="transition-smooth"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  placeholder="Sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  className="transition-smooth"
                />
              </div>

              {erro && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-gradient-ocean border-0 shadow-glow transition-smooth"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Botões de demonstração */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Demonstração - Clique para preencher:
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={preencherAdmin}
                  className="flex-1"
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={preencherUsuario}
                  className="flex-1"
                >
                  Usuário
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé */}
        <div className="text-center text-white/60 text-sm">
          <p>© 2024 Sistema de Gestão de Mergulho</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
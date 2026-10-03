import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import CampoFormulario from './CampoFormulario';
import Marca from './Marca';
import SeletorTema from './SeletorTema';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const { login } = useAuth();

  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // Em caso de sucesso, o redirecionamento é tratado pelo PublicRoute
    const resultado = await login(email, senha);
    if (!resultado.ok) {
      setErro(resultado.erro || 'Email ou senha incorretos');
    }

    setCarregando(false);
  };

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <div className="flex justify-end p-4">
        <SeletorTema />
      </div>

      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm space-y-8">
          <div className="space-y-6">
            <Marca />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Entrar</h1>
              <p className="text-sm text-muted-foreground">Acesse a gestão da sua empresa.</p>
            </div>
          </div>

          <form onSubmit={entrar} className="space-y-4" noValidate>
            <CampoFormulario id="email" rotulo="Email">
              {(campo) => (
                <Input
                  {...campo}
                  type="email"
                  autoComplete="username"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              )}
            </CampoFormulario>

            <div className="relative">
              <CampoFormulario id="senha" rotulo="Senha">
                {(campo) => (
                  <Input
                    {...campo}
                    type={mostrarSenha ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                    className="pr-11"
                  />
                )}
              </CampoFormulario>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-[30px] h-8 w-8 text-muted-foreground"
                onClick={() => setMostrarSenha((m) => !m)}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                aria-pressed={mostrarSenha}
              >
                {mostrarSenha ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </div>

            {erro && (
              <Alert variant="destructive" role="alert">
                <AlertCircle className="h-4 w-4" aria-hidden="true" />
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={carregando}>
              {carregando && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
              {carregando ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </main>

      <footer className="p-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} Integra</footer>
    </div>
  );
};

export default LoginForm;

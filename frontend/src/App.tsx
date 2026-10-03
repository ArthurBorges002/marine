import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { menuOrganizacao, ROTA_PLATAFORMA } from "@/lib/navegacao";

import LoginForm from "@/components/LoginForm";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import SemAcesso from "@/components/SemAcesso";
import Funcionarios from "@/pages/Funcionarios";
import Equipamentos from "@/pages/Equipamentos";
import Projetos from "@/pages/Projetos";
import Financas from "@/pages/Financas";
import Novo_Funcionario from "@/pages/Novo_Funcionario";
import Configuracoes_Cadastros from "./pages/Configuracoes_Cadastros";
import OrganizacoesPage from "@/modules/plataforma/OrganizacoesPage";
import ConfiguracoesPage from "@/modules/administracao/ConfiguracoesPage";
import UsuariosPage from "@/modules/administracao/UsuariosPage";
import PerfisPage from "@/modules/administracao/PerfisPage";
import PerfilEditorPage from "@/modules/administracao/PerfilEditorPage";
import AuditoriaPage from "@/modules/administracao/AuditoriaPage";
import MinhaContaPage from "@/modules/administracao/MinhaContaPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

/**
 * Telas de negócio: só para usuários de uma organização e, se informada, com a permissão
 * do catálogo (a API verifica de novo). Sem permissão, explica em vez de esconder.
 */
const RotaOrganizacao = ({ children, permissao }: { children: React.ReactNode; permissao?: string }) => {
  const { usuario, pode } = useAuth();
  if (usuario?.administradorPlataforma) return <Navigate to={ROTA_PLATAFORMA} replace />;
  if (permissao && !pode(permissao)) return <SemAcesso />;
  return <>{children}</>;
};

/** Administração do SaaS: só para o administrador da plataforma. */
const RotaPlataforma = ({ children }: { children: React.ReactNode }) => {
  const { usuario } = useAuth();
  return usuario?.administradorPlataforma ? <>{children}</> : <Navigate to="/" replace />;
};

/** Início: o dashboard, ou a primeira tela que o perfil permite. */
const Inicio = () => {
  const { usuario, pode } = useAuth();
  if (usuario?.administradorPlataforma) return <Navigate to={ROTA_PLATAFORMA} replace />;
  if (pode("dashboard.ver")) return <Dashboard />;
  const primeira = menuOrganizacao.find((item) => item.rota !== "/" && (item.permissao === null || pode(item.permissao)));
  return <Navigate to={primeira?.rota ?? "/minha-conta"} replace />;
};

/** O mesmo formulário cria (rh.funcionarios.criar) e edita (rh.funcionarios.editar). */
const RotaFormularioFuncionario = () => {
  const [params] = useSearchParams();
  const permissao = params.get("acao") === "editar" ? "rh.funcionarios.editar" : "rh.funcionarios.criar";
  return <RotaOrganizacao permissao={permissao}><Novo_Funcionario /></RotaOrganizacao>;
};

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} storageKey="integra-tema">
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />

      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginForm />
                </PublicRoute>
              }
            />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Inicio />} />
              <Route path="funcionarios" element={<RotaOrganizacao permissao="rh.funcionarios.ver"><Funcionarios /></RotaOrganizacao>} />
              <Route path="novo_funcionario" element={<RotaFormularioFuncionario />} />
              <Route path="equipamentos" element={<RotaOrganizacao permissao="operacional.equipamentos.ver"><Equipamentos /></RotaOrganizacao>} />
              <Route path="projetos" element={<RotaOrganizacao permissao="contratos.projetos.ver"><Projetos /></RotaOrganizacao>} />
              <Route path="financas" element={<RotaOrganizacao permissao="financeiro.ver"><Financas /></RotaOrganizacao>} />

              <Route path="configuracoes" element={<RotaOrganizacao><ConfiguracoesPage /></RotaOrganizacao>} />
              <Route path="configuracoes/usuarios" element={<RotaOrganizacao permissao="admin.usuarios.ver"><UsuariosPage /></RotaOrganizacao>} />
              <Route path="configuracoes/perfis" element={<RotaOrganizacao permissao="admin.perfis.ver"><PerfisPage /></RotaOrganizacao>} />
              <Route path="configuracoes/perfis/novo" element={<RotaOrganizacao permissao="admin.perfis.gerenciar"><PerfilEditorPage /></RotaOrganizacao>} />
              <Route path="configuracoes/perfis/:id" element={<RotaOrganizacao permissao="admin.perfis.ver"><PerfilEditorPage /></RotaOrganizacao>} />
              <Route path="configuracoes/auditoria" element={<RotaOrganizacao permissao="admin.auditoria.ver"><AuditoriaPage /></RotaOrganizacao>} />
              <Route path="configuracoes/cadastros" element={<RotaOrganizacao permissao="admin.configuracoes.editar"><Configuracoes_Cadastros /></RotaOrganizacao>} />
              {/* endereço antigo */}
              <Route path="configuracoes_cadastros" element={<Navigate to="/configuracoes/cadastros" replace />} />

              <Route path="minha-conta" element={<MinhaContaPage />} />

              <Route path="plataforma/organizacoes" element={<RotaPlataforma><OrganizacoesPage /></RotaPlataforma>} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;

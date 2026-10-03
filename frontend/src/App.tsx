import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import LoginForm from "@/components/LoginForm";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Funcionarios from "@/pages/Funcionarios";
import Equipamentos from "@/pages/Equipamentos";
import Projetos from "@/pages/Projetos";
import Financas from "@/pages/Financas";
import Configuracoes from "@/pages/Configuracoes";
import Novo_Funcionario from "@/pages/Novo_Funcionario";
import Configuracoes_Cadastros from "./pages/Configuracoes_Cadastros";
import OrganizacoesPage from "@/modules/plataforma/OrganizacoesPage";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const ROTA_PLATAFORMA = "/plataforma/organizacoes";

/** Telas de negócio: só para usuários de uma organização (a API também bloqueia). */
const RotaOrganizacao = ({ children }: { children: React.ReactNode }) => {
  const { usuario } = useAuth();
  return usuario?.administradorPlataforma ? <Navigate to={ROTA_PLATAFORMA} replace /> : <>{children}</>;
};

/** Administração do SaaS: só para o administrador da plataforma. */
const RotaPlataforma = ({ children }: { children: React.ReactNode }) => {
  const { usuario } = useAuth();
  return usuario?.administradorPlataforma ? <>{children}</> : <Navigate to="/" replace />;
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
              <Route index element={<RotaOrganizacao><Dashboard /></RotaOrganizacao>} />
              <Route path="funcionarios" element={<RotaOrganizacao><Funcionarios /></RotaOrganizacao>} />
              <Route path="equipamentos" element={<RotaOrganizacao><Equipamentos /></RotaOrganizacao>} />
              <Route path="projetos" element={<RotaOrganizacao><Projetos /></RotaOrganizacao>} />
              <Route path="financas" element={<RotaOrganizacao><Financas /></RotaOrganizacao>} />
              <Route path="configuracoes" element={<RotaOrganizacao><Configuracoes /></RotaOrganizacao>} />
              <Route path="novo_funcionario" element={<RotaOrganizacao><Novo_Funcionario /></RotaOrganizacao>} />
              <Route path="configuracoes_cadastros" element={<RotaOrganizacao><Configuracoes_Cadastros /></RotaOrganizacao>} />

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

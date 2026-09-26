import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import "./css/orcamentos.css"

import LoginForm from "@/components/LoginForm";
import Layout from "@/components/Layout";
import Dashboard from "@/components/Dashboard";
import Orcamentos from "@/pages/Orcamentos";
import Funcionarios from "@/pages/Funcionarios";
import Equipamentos from "@/pages/Equipamentos";
import Projetos from "@/pages/Projetos";
import Financas from "@/pages/Financas";
import Configuracoes from "@/pages/Configuracoes";
import Novo_Orcamento from "@/pages/Novo_Orcamento";
import Novo_Modelo_Orcamento from "@/pages/Novo_Modelo_Orcamento";
import Alterar_Modelo_Orcamento from "@/pages/Alterar_Modelo_Orcamento";
import Novo_Modelo_Capa from "@/pages/Novo_Modelo_Capa";
import Alterar_Modelo_Capa from "@/pages/Alterar_Modelo_Capa";
import Novo_Template_Orcamento from "@/pages/Novo_Template_Orcamento";
import Novo_Funcionario from "@/pages/Novo_Funcionario";
import Configuracoes_Cadastros from "./pages/Configuracoes_Cadastros";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* ✅ Toaster do Sonner */}
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
              <Route index element={<Dashboard />} />
              <Route path="orcamentos" element={<Orcamentos />} />
              <Route path="funcionarios" element={<Funcionarios />} />
              <Route path="equipamentos" element={<Equipamentos />} />
              <Route path="projetos" element={<Projetos />} />
              <Route path="financas" element={<Financas />} />
              <Route path="configuracoes" element={<Configuracoes />} />
              <Route path="novo_orcamento" element={<Novo_Orcamento />} />
              <Route path="novo_modelo_orcamento" element={<Novo_Modelo_Orcamento />} />
              <Route path="alterar_modelo_orcamento" element={<Alterar_Modelo_Orcamento />} />
              <Route path="novo_modelo_capa" element={<Novo_Modelo_Capa />} />
              <Route path="alterar_modelo_capa" element={<Alterar_Modelo_Capa />} />
              <Route path="novo_template_orcamento" element={<Novo_Template_Orcamento />} />
              <Route path="novo_funcionario" element={<Novo_Funcionario />} />
              <Route path="configuracoes_cadastros" element={<Configuracoes_Cadastros />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

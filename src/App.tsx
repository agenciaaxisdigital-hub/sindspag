import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssociadoForm from "./pages/AssociadoForm";
import Usuarios from "./pages/Usuarios";
import AppLayout from "./components/AppLayout";
import NotFound from "./pages/NotFound";
import VersionMonitor from "./components/VersionMonitor";
import InstallPWA from "./components/InstallPWA";
import { useOfflineSync } from "./hooks/useOfflineSync";

const queryClient = new QueryClient();

// Injetor de Fila Offline global
function GlobalOfflineSync() {
  useOfflineSync();
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GlobalOfflineSync />
      <InstallPWA />
      <VersionMonitor />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<AppLayout />}>
              <Route path="/cadastro" element={<AssociadoForm />} />
              <Route path="/associados" element={<Dashboard />} />
              <Route path="/associado/:id" element={<AssociadoForm />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/dashboard" element={<Navigate to="/associados" replace />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

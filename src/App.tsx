import { QueryClient } from "@tanstack/react-query";
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

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: "offlineFirst",
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60 * 24,
      retry: (failureCount, error: unknown) => {
        const msg = (error as Error)?.message || "";
        if (msg.includes("JWT") || msg.includes("401")) return false;
        return failureCount < 2;
      },
    },
    mutations: {
      networkMode: "offlineFirst",
    },
  },
});

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "sindspag_rq_cache_v1",
  throttleTime: 1000,
});

// Injetor de Fila Offline global
function GlobalOfflineSync() {
  useOfflineSync();
  return null;
}

const App = () => (
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{
      persister,
      maxAge: 1000 * 60 * 60 * 24,
      dehydrateOptions: {
        shouldDehydrateQuery: (query) => query.state.status === "success",
      },
    }}
  >
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
  </PersistQueryClientProvider>
);

export default App;

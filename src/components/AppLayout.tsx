import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, LogOut, PlusCircle, Settings, Zap } from "lucide-react";
import SplashScreen from "./SplashScreen";

const AppLayout = () => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <SplashScreen />;
  if (!user) return <Navigate to="/" replace />;

  const navItems = [
    { to: "/cadastro", label: "Cadastrar", icon: PlusCircle },
    { to: "/associados", label: "Associados", icon: Users },
    ...(user.cargo === "admin" ? [{ to: "/usuarios", label: "Usuários", icon: Settings }] : []),
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top header - dark gamified */}
      <header className="relative overflow-hidden bg-[hsl(222,28%,9%)] border-b border-white/5">
        {/* Subtle grid bg */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(22,100%,52%/0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(22,100%,52%/0.5) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glow spot */}
        <div className="absolute top-0 left-1/4 w-64 h-16 bg-primary/10 blur-2xl rounded-full" />

        <div className="container mx-auto flex items-center justify-between h-16 px-4 relative z-10">
          <div className="flex items-center gap-2.5">
            {/* Logo icon */}
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center shadow-[0_0_12px_hsl(22,100%,52%/0.4)]">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span
              className="font-black text-white text-lg tracking-widest uppercase"
              style={{ fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.12em" }}
            >
              SINDSPAG
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* User chip */}
            <div className="hidden sm:flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_hsl(160,84%,60%)]" />
              <span className="text-white/60 text-xs">
                Olá, <span className="text-white font-semibold">{user.nome}</span>
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl border border-white/0 hover:border-white/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-semibold">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 sm:p-6 pb-40">
        <Outlet />
      </main>

      {/* Bottom navigation bar - gamified */}
      <nav className="fixed bottom-0 left-0 right-0 z-50">
        <div className="bg-[hsl(222,28%,9%)/95] backdrop-blur-xl border-t border-white/8 shadow-[0_-4px_32px_hsl(222,28%,4%/0.8)]">
          <div className="container mx-auto flex items-center justify-around h-[4.5rem] px-2">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.to ||
                (item.to === "/cadastro" && location.pathname.startsWith("/associado/"));
              return (
                <Link key={item.to} to={item.to} className="flex-1">
                  <div
                    className={`relative flex flex-col items-center gap-1 py-2 transition-all duration-300 ${
                      isActive ? "scale-105" : "hover:scale-105"
                    }`}
                  >
                    {/* Active glow bg */}
                    {isActive && (
                      <div className="absolute inset-x-2 inset-y-0 rounded-xl bg-primary/10 border border-primary/20 shadow-[0_0_16px_hsl(22,100%,52%/0.15)]" />
                    )}

                    <div
                      className={`relative p-2 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "text-primary drop-shadow-[0_0_8px_hsl(22,100%,52%/0.8)]"
                          : "text-white/30 hover:text-white/60"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${isActive ? "stroke-[2.5]" : ""}`} />
                    </div>
                    <span
                      className={`relative text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        isActive ? "text-primary" : "text-white/30"
                      }`}
                    >
                      {item.label}
                    </span>

                    {/* Active dot indicator */}
                    {isActive && (
                      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_hsl(22,100%,52%)]" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
          {/* Bottom safe area */}
          <div className="h-safe-area-inset-bottom" />
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;

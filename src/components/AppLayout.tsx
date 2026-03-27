import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, LogOut } from "lucide-react";
import logo from "@/assets/sindspag-logo.png";

const AppLayout = () => {
  const { user, logout, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;
  if (!user) return <Navigate to="/" replace />;

  const navItems = [
    { to: "/dashboard", label: "Associados", icon: Users },
    ...(user.cargo === "admin" ? [{ to: "/usuarios", label: "Usuários", icon: UserPlus }] : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="SINDSPAG" className="h-10 object-contain" />
            <span className="font-bold text-foreground hidden sm:block">SINDSPAG</span>
          </div>
          <nav className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link key={item.to} to={item.to}>
                <Button
                  variant={location.pathname === item.to ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-destructive">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

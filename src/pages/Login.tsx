import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Zap, ChevronRight } from "lucide-react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const savedNome = localStorage.getItem("sindspag_remembered_user");
    if (savedNome) {
      setNome(savedNome);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (rememberMe) {
      localStorage.setItem("sindspag_remembered_user", nome);
    } else {
      localStorage.removeItem("sindspag_remembered_user");
    }

    const result = await login(nome, senha);
    setLoading(false);
    if (result.success) {
      navigate("/cadastro");
    } else {
      setError(result.message || "Erro ao fazer login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[hsl(222,28%,7%)] p-4 relative overflow-hidden">

      {/* Animated grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(22,100%,52%/0.06) 1px, transparent 1px), linear-gradient(90deg, hsl(22,100%,52%/0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-600/6 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[200px] h-[200px] bg-amber-400/5 blur-[60px] rounded-full pointer-events-none" />

      {/* Decorative corner orbs */}
      <div className="absolute top-12 left-12 w-2 h-2 rounded-full bg-primary opacity-40 animate-pulse" />
      <div className="absolute top-24 left-32 w-1 h-1 rounded-full bg-orange-300 opacity-30 animate-pulse" style={{ animationDelay: "600ms" }} />
      <div className="absolute bottom-20 right-20 w-2 h-2 rounded-full bg-primary opacity-30 animate-pulse" style={{ animationDelay: "300ms" }} />
      <div className="absolute bottom-32 right-40 w-1 h-1 rounded-full bg-amber-400 opacity-40 animate-pulse" style={{ animationDelay: "900ms" }} />

      <div className="w-full max-w-sm relative z-10 animate-slide-up">
        {/* Logo block */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center mb-6 relative">
            {/* Outer ring animation */}
            <div className="absolute inset-0 rounded-2xl border border-primary/20 scale-125 animate-pulse" />
            <div className="h-16 w-16 rounded-2xl gradient-primary flex items-center justify-center shadow-[0_0_32px_hsl(22,100%,52%/0.4)]">
              <Zap className="h-8 w-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
          <h1
            className="text-3xl font-black text-white tracking-[0.15em] uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SINDSPAG
          </h1>
          <p className="text-white/30 text-xs mt-2 tracking-widest uppercase font-medium">
            Sistema de Gestão de Associados
          </p>
        </div>

        {/* Login card */}
        <div className="relative rounded-2xl overflow-hidden">
          {/* Card border glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/8 to-white/3 border border-white/10" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <div className="relative p-7 backdrop-blur-xl bg-[hsl(222,25%,10%)/80]">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest text-center mb-6">
              Acesso ao sistema
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="nome" className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Usuário
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <Input
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome de usuário"
                    required
                    className="pl-10 h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:bg-white/8 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="senha" className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/25" />
                  <Input
                    id="senha"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    placeholder="Sua senha"
                    required
                    className="pl-10 h-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 focus:bg-white/8 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 py-1">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary accent-primary cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-xs font-medium text-white/40 cursor-pointer hover:text-white/60 transition-colors"
                >
                  Salvar credenciais
                </label>
              </div>

              {error && (
                <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-xl border border-red-500/20 text-center font-medium">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-12 rounded-xl text-sm font-bold uppercase tracking-wider gradient-primary shadow-[0_0_20px_hsl(22,100%,52%/0.3)] hover:shadow-[0_0_30px_hsl(22,100%,52%/0.5)] hover:scale-[1.01] transition-all duration-200 mt-2 gap-2"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Entrando...
                  </span>
                ) : (
                  <>
                    Entrar
                    <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        <p className="text-white/20 text-xs text-center mt-8 leading-relaxed">
          Sindicato dos Servidores Públicos Municipais<br />de Aparecida de Goiânia
        </p>
      </div>
    </div>
  );
};

export default Login;

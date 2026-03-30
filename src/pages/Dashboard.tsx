import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Edit, Trash2, Users, UserCheck, UserX, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

// Animated counter hook
function useCounter(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setValue(target); clearInterval(timer); }
      else setValue(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

const StatCard = ({
  value,
  label,
  icon: Icon,
  colorClass,
  glowClass,
  delay = 0,
}: {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
  glowClass: string;
  delay?: number;
}) => {
  const animated = useCounter(value);
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-[hsl(222,22%,11%)] p-4 transition-all duration-300 hover:border-white/15 hover:scale-[1.02] group"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Glow bg */}
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 transition-opacity duration-300 group-hover:opacity-35 ${colorClass}`} />

      <div className="relative flex items-center gap-3">
        <div
          className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${colorClass} ${glowClass} bg-opacity-15 transition-all duration-300 group-hover:scale-110`}
          style={{ background: "transparent", boxShadow: "none" }}
        >
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${colorClass} bg-opacity-15`}
            style={{ backgroundColor: "color-mix(in srgb, currentColor 12%, transparent)" }}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div>
          <p
            className="text-3xl font-black text-white leading-none tabular-nums"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontVariantNumeric: "tabular-nums" }}
          >
            {animated}
          </p>
          <p className="text-[11px] text-white/40 font-semibold uppercase tracking-wider mt-0.5">{label}</p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] ${colorClass} opacity-40 rounded-full`} />
    </div>
  );
};

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: associados, isLoading, refetch } = useQuery({
    queryKey: ["sindspag_associados"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sindspag_associados")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir?")) return;
    const { error } = await supabase.from("sindspag_associados").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir");
    } else {
      toast.success("Excluído com sucesso");
      refetch();
    }
  };

  const filtered = associados?.filter((a) =>
    a.nome.toLowerCase().includes(search.toLowerCase())
  );

  const totalAssociados = associados?.length || 0;
  const totalSocios = associados?.filter((a) => a.eh_socio_atual).length || 0;
  const totalNaoSocios = totalAssociados - totalSocios;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Painel</span>
          </div>
          <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Associados
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie todos os associados cadastrados</p>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[76px] rounded-2xl bg-muted/40 animate-pulse" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              value={totalAssociados}
              label="Total"
              icon={Users}
              colorClass="text-orange-400 bg-orange-400"
              glowClass="shadow-[0_0_16px_hsl(22,100%,52%/0.3)]"
              delay={0}
            />
            <StatCard
              value={totalSocios}
              label="Sócios"
              icon={UserCheck}
              colorClass="text-emerald-400 bg-emerald-400"
              glowClass="shadow-[0_0_16px_hsl(160,84%,50%/0.3)]"
              delay={80}
            />
            <StatCard
              value={totalNaoSocios}
              label="Não sócios"
              icon={UserX}
              colorClass="text-amber-400 bg-amber-400"
              glowClass="shadow-[0_0_16px_hsl(45,93%,47%/0.3)]"
              delay={160}
            />
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-11 rounded-xl bg-card border-border/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <span className="h-10 w-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin block" />
              <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />
            </div>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Carregando...</span>
          </div>
        </div>
      ) : (
        <Card className="border border-border/40 bg-card shadow-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/40">
                <TableHead className="font-bold text-foreground/80 text-xs uppercase tracking-wider">Nome</TableHead>
                <TableHead className="font-bold text-foreground/80 text-xs uppercase tracking-wider">Telefone</TableHead>
                <TableHead className="font-bold text-foreground/80 text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="font-bold text-foreground/80 text-xs uppercase tracking-wider">Sócio</TableHead>
                <TableHead className="w-24 font-bold text-foreground/80 text-xs uppercase tracking-wider">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered?.map((a, idx) => (
                <TableRow
                  key={a.id}
                  className="hover:bg-primary/[0.04] transition-colors border-b border-border/30 group"
                  style={{ animationDelay: `${idx * 30}ms` }}
                >
                  <TableCell className="font-semibold text-foreground">{a.nome}</TableCell>
                  <TableCell className="text-muted-foreground font-mono text-sm">{a.telefone || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        a.status === "Ativo"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : a.status === "Inativo"
                          ? "bg-red-500/10 text-red-500 border border-red-500/20"
                          : "bg-muted text-muted-foreground border border-border/30"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {a.status || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        a.eh_socio_atual
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border/30"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {a.eh_socio_atual ? "Sim" : "Não"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate(`/associado/${a.id}`)}
                        className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      {user?.cargo === "admin" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(a.id)}
                          className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-14 w-14 rounded-2xl bg-muted/60 flex items-center justify-center">
                        <Users className="h-7 w-7 opacity-30" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Nenhum associado encontrado</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">Tente outro termo de busca</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;

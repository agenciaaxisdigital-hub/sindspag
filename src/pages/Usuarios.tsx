import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { UserPlus, Shield, Crown, Trash2 } from "lucide-react";

const Usuarios = () => {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: usuarios, refetch } = useQuery({
    queryKey: ["sindspag_usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sindspag_usuarios")
        .select("id, nome, cargo, criado_em")
        .order("criado_em");
      if (error) throw error;
      return data;
    },
  });

  const handleDelete = async (id: string, nome: string) => {
    if (!confirm(`Deseja realmente excluir o usuário "${nome}"?`)) return;
    
    setLoading(true);
    const { error } = await supabase
      .from("sindspag_usuarios")
      .delete()
      .eq("id", id);
    setLoading(false);
    
    if (error) {
      toast.error("Erro ao excluir usuário: " + error.message);
    } else {
      toast.success(`Usuário "${nome}" excluído com sucesso!`);
      refetch();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !senha.trim()) {
      toast.error("Preencha nome e senha");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.rpc("sindspag_criar_usuario", {
      p_nome: nome,
      p_senha: senha,
    });
    setLoading(false);
    const result = data as any;
    if (error || !result?.success) {
      toast.error(result?.message || "Erro ao criar usuário");
    } else {
      toast.success("Usuário criado!");
      setNome("");
      setSenha("");
      refetch();
    }
  };

  if (user?.cargo !== "admin") return <Navigate to="/dashboard" replace />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Shield className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Admin</span>
        </div>
        <h1 className="text-2xl font-black text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          Usuários
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Gerencie os usuários do sistema</p>
      </div>

      {/* Create user card */}
      <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-card shadow-card">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center shadow-elevated">
              <UserPlus className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Criar Novo Usuário</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome</Label>
              <Input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do usuário"
                required
                className="h-11 rounded-xl border-border/40 bg-muted/30 focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Senha</Label>
              <Input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha"
                required
                className="h-11 rounded-xl border-border/40 bg-muted/30 focus:bg-card focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                disabled={loading}
                className="h-11 px-6 rounded-xl gradient-primary border-0 shadow-elevated font-bold uppercase tracking-wider text-xs hover:shadow-[0_0_20px_hsl(22,100%,52%/0.4)] hover:scale-[1.02] transition-all"
              >
                {loading ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </div>

      {/* Users list card */}
      <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-card shadow-card">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2.5 text-base">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_4px_12px_hsl(221,83%,53%/0.3)]">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Usuários Cadastrados</span>
            {usuarios && (
              <span className="ml-auto text-xs font-bold bg-muted text-muted-foreground px-2.5 py-1 rounded-full border border-border/40">
                {usuarios.length}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b border-border/40">
                <TableHead className="font-bold text-foreground/80 text-xs uppercase tracking-wider">Nome</TableHead>
                <TableHead className="font-bold text-foreground/80 text-xs uppercase tracking-wider">Cargo</TableHead>
                <TableHead className="w-20 font-bold text-foreground/80 text-xs uppercase tracking-wider text-right">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios?.map((u) => (
                <TableRow key={u.id} className="hover:bg-primary/[0.04] transition-colors border-b border-border/30">
                  <TableCell className="font-semibold text-foreground flex items-center gap-2">
                    {u.cargo === "admin" && <Crown className="h-3.5 w-3.5 text-amber-400" />}
                    {u.nome}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        u.cargo === "admin"
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "bg-muted text-muted-foreground border border-border/30"
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {u.cargo}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(u.id, u.nome)}
                      className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </div>
    </div>
  );
};

export default Usuarios;

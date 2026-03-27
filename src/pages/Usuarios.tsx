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
import { UserPlus } from "lucide-react";

const Usuarios = () => {
  const { user } = useAuth();
  const [nome, setNome] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const { data: usuarios, refetch } = useQuery({
    queryKey: ["sindspag_usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sindspag_usuarios").select("id, nome, cargo, criado_em").order("criado_em");
      if (error) throw error;
      return data;
    },
  });

  if (user?.cargo !== "admin") return <Navigate to="/dashboard" replace />;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !senha.trim()) { toast.error("Preencha nome e senha"); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc("sindspag_criar_usuario", { p_nome: nome, p_senha: senha });
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Gerenciar Usuários</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Criar Novo Usuário
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 space-y-1">
              <Label>Nome</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do usuário" required />
            </div>
            <div className="flex-1 space-y-1">
              <Label>Senha</Label>
              <Input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" required />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Criando..." : "Criar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usuários Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cargo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios?.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.nome}</TableCell>
                  <TableCell className="capitalize">{u.cargo}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Usuarios;

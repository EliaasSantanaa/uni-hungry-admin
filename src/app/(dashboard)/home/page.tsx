"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogOut, User, Mail, Shield } from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const { user, signOut, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    const loadingToast = toast.loading("Saindo...", {
      description: "Encerrando sua sessão",
    });

    try {
      await signOut();
      toast.dismiss(loadingToast);
      toast.success("Até logo!", {
        description: "Você foi desconectado com sucesso",
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Erro ao sair", {
        description: "Tente novamente",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5">
        <CardHeader>
          <CardTitle className="text-2xl">Bem-vindo ao UniHungry!</CardTitle>
          <CardDescription>
            Sistema de gestão de pedidos universitários
          </CardDescription>
        </CardHeader>
      </Card>

      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>Seus dados de acesso ao sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <Mail className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base font-semibold">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <User className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                ID do Usuário
              </p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse as principais funcionalidades
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Button
            variant="outline"
            className="h-auto flex-col items-start p-4 space-y-2"
          >
            <Shield className="h-6 w-6 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Admin</p>
              <p className="text-xs text-muted-foreground">
                Painel administrativo
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col items-start p-4 space-y-2"
          >
            <User className="h-6 w-6 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Perfil</p>
              <p className="text-xs text-muted-foreground">
                Editar informações
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto flex-col items-start p-4 space-y-2"
            onClick={handleSignOut}
          >
            <LogOut className="h-6 w-6 text-primary" />
            <div className="text-left">
              <p className="font-semibold">Sair</p>
              <p className="text-xs text-muted-foreground">Encerrar sessão</p>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle>Status do Sistema</CardTitle>
          <CardDescription>Informações sobre o ambiente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Versão</span>
              <span className="text-sm font-mono">1.0.0</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

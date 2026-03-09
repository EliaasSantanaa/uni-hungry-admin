"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Rotas públicas que não precisam de proteção
    const publicPaths = ["/auth/login", "/auth/confirm"];
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Se não está carregando e não há usuário e não é rota pública
    if (!loading && !user && !isPublicPath) {
      router.replace("/auth/login");
    }

    // Se usuário autenticado está tentando acessar página de auth
    if (!loading && user && publicPaths.includes(pathname)) {
      router.replace("/home");
    }
  }, [user, loading, router, pathname]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Se não tem usuário e não é rota pública, não renderiza nada
  // (o useEffect vai redirecionar)
  const publicPaths = ["/auth/login", "/auth/confirm"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  if (!user && !isPublicPath) {
    return null;
  }

  return <>{children}</>;
}

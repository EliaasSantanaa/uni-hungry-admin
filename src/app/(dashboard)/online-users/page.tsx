"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useOnlineUsers } from "@/hooks/use-online-users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Radio,
  RefreshCw,
  ExternalLink,
  Users,
  ChevronRight,
} from "lucide-react";
import { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MANAGER]: "Gerente",
  [UserRole.USER]: "Usuário",
  [UserRole.WAITER]: "Garçom",
};

function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

function formatLastSeen(lastSeenAt: string) {
  const date = new Date(lastSeenAt);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60_000);

  if (diffMinutes < 1) {
    return "Agora";
  }

  if (diffMinutes < 60) {
    return `Há ${diffMinutes} min`;
  }

  return date.toLocaleString("pt-BR");
}

function getMapsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}

export default function OnlineUsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    users,
    total,
    onlineThresholdMinutes,
    loading,
    refresh,
  } = useOnlineUsers();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user && user.role !== UserRole.ADMIN) {
      router.push("/home");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (user.role !== UserRole.ADMIN) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Radio className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Usuários Online</h1>
            <p className="text-muted-foreground">
              Usuários conectados no app mobile com localização em tempo real
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => void refresh()}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Online agora</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <div className="text-3xl font-bold text-green-600">{total}</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critério online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              Últimos {onlineThresholdMinutes} minutos
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Atualização automática a cada 30 segundos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Fonte</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">App Mobile</div>
            <p className="text-xs text-muted-foreground mt-1">
              Heartbeat enviado após login com permissão de localização
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Lista de usuários
          </CardTitle>
          <CardDescription>
            {total === 0
              ? "Nenhum usuário online no momento"
              : `${total} usuário${total === 1 ? "" : "s"} com presença ativa`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading && users.length === 0 ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-24 w-full" />
            ))
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Radio className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Nenhum usuário online encontrado.</p>
              <p className="text-sm mt-1">
                Os usuários aparecem aqui após fazer login no app mobile e
                conceder permissão de localização.
              </p>
            </div>
          ) : (
            users.map((onlineUser) => (
              <div
                key={onlineUser.userId}
                className="flex flex-col gap-3 p-4 border rounded-lg md:flex-row md:items-center md:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {onlineUser.name || "Sem nome"}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Online
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {onlineUser.email}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{roleLabels[onlineUser.role]}</span>
                    {onlineUser.restaurant ? (
                      <>
                        <span>•</span>
                        <span>{onlineUser.restaurant.name}</span>
                      </>
                    ) : null}
                    <span>•</span>
                    <span>Visto {formatLastSeen(onlineUser.lastSeenAt)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-mono text-xs sm:text-sm">
                      {formatCoordinates(
                        onlineUser.latitude,
                        onlineUser.longitude,
                      )}
                    </span>
                    {onlineUser.accuracy != null ? (
                      <span className="text-xs text-muted-foreground">
                        (±{Math.round(onlineUser.accuracy)}m)
                      </span>
                    ) : null}
                  </div>

                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={getMapsUrl(
                        onlineUser.latitude,
                        onlineUser.longitude,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Ver no mapa
                    </a>
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Button variant="ghost" asChild>
        <Link href="/home">
          Voltar ao dashboard
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </Button>
    </div>
  );
}

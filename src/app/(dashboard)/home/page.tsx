"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useDashboard } from "@/hooks/use-dashboard";
import { useOnlineUsers } from "@/hooks/use-online-users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Store,
  UserCheck,
  UtensilsCrossed,
  LayoutGrid,
  Receipt,
  Banknote,
  ChevronRight,
  Radio,
} from "lucide-react";
import { UserRole } from "@/types";
import { formatCurrency } from "@/lib/format";

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MANAGER]: "Gerente",
  [UserRole.USER]: "Usuário",
  [UserRole.WAITER]: "Garçom",
};

const quickLinks = [
  { href: "/online-users", label: "Usuários Online", icon: Radio },
  { href: "/restaurants", label: "Restaurantes", icon: Store },
  { href: "/menu", label: "Cardápio", icon: UtensilsCrossed },
  { href: "/tables", label: "Mesas", icon: LayoutGrid },
  { href: "/tabs", label: "Comandas", icon: Receipt },
  { href: "/customers", label: "Usuários", icon: Users },
];

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading, fetchStats } = useDashboard();
  const { total: onlineTotal, loading: onlineLoading } = useOnlineUsers();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
    if (user?.role === UserRole.ADMIN) {
      void fetchStats();
    }
  }, [user, authLoading, router, fetchStats]);

  if (authLoading || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  if (user.role !== UserRole.ADMIN) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Acesso restrito</CardTitle>
            <CardDescription>
              Este painel é exclusivo para administradores do sistema.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const ops = stats?.operations;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center gap-3">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">
            Visão geral do ecossistema UniHungry
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Plataforma
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Usuários"
            value={stats?.totalCustomers}
            sub={`${stats?.activeCustomers ?? 0} ativos`}
            icon={Users}
            loading={statsLoading}
          />
          <StatCard
            title="Restaurantes"
            value={stats?.totalRestaurants}
            sub={`${stats?.activeRestaurants ?? 0} ativos`}
            icon={Store}
            loading={statsLoading}
          />
          <StatCard
            title="Gerentes"
            value={stats?.customersByRole?.manager}
            sub="Proprietários"
            icon={UserCheck}
            loading={statsLoading}
          />
          <StatCard
            title="Garçons"
            value={stats?.customersByRole?.waiter}
            sub="Em restaurantes"
            icon={Users}
            loading={statsLoading}
          />
          <StatCard
            title="Online agora"
            value={onlineTotal}
            sub="No app mobile"
            icon={Radio}
            loading={onlineLoading}
          />
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Operações (hoje)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Faturamento hoje"
            value={ops ? formatCurrency(ops.revenueToday) : undefined}
            sub="Comandas fechadas"
            icon={Banknote}
            loading={statsLoading}
            isText
          />
          <StatCard
            title="Comandas abertas"
            value={ops?.openTabs}
            sub={`${ops?.closedTabsToday ?? 0} fechadas hoje`}
            icon={Receipt}
            loading={statsLoading}
          />
          <StatCard
            title="Itens no cardápio"
            value={ops?.totalMenuItems}
            sub={`${ops?.availableMenuItems ?? 0} disponíveis`}
            icon={UtensilsCrossed}
            loading={statsLoading}
          />
          <StatCard
            title="Mesas"
            value={ops?.totalTables}
            sub={`${ops?.cancelledTabsToday ?? 0} canceladas hoje`}
            icon={LayoutGrid}
            loading={statsLoading}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Acesso rápido</CardTitle>
          <CardDescription>Navegue pelos módulos operacionais</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Button key={href} variant="outline" className="h-auto py-3" asChild>
              <Link href={href} className="flex flex-col items-center gap-1">
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Link>
            </Button>
          ))}
        </CardContent>
      </Card>

      {stats?.recentCustomers && stats.recentCustomers.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Usuários recentes</CardTitle>
            <CardDescription>Últimos cadastros no sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {stats.recentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {roleLabels[customer.role as UserRole]}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-2" asChild>
              <Link href="/customers">
                Ver todos os usuários
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  loading,
  isText,
}: {
  title: string;
  value?: number | string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
  isText?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <div
              className={
                isText ? "text-xl font-bold" : "text-3xl font-bold"
              }
            >
              {value ?? 0}
            </div>
            {sub ? (
              <p className="text-xs text-muted-foreground mt-1">{sub}</p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
}

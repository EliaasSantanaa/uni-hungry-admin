"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAdminData } from "@/hooks/use-admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { UserRole } from "@/types";
import {
  Store,
  ArrowLeft,
  Users,
  UtensilsCrossed,
  LayoutGrid,
  Receipt,
  Banknote,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  [UserRole.MANAGER]: "Gerente",
  [UserRole.WAITER]: "Garçom",
  [UserRole.USER]: "Usuário",
  [UserRole.ADMIN]: "Admin",
};

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { restaurantDetail, loading, fetchRestaurantById } = useAdminData();

  useEffect(() => {
    if (id) void fetchRestaurantById(id);
  }, [id, fetchRestaurantById]);

  if (loading && !restaurantDetail) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!restaurantDetail) {
    return (
      <div className="container mx-auto py-6 px-4">
        <p className="text-muted-foreground">Restaurante não encontrado.</p>
        <Button variant="link" asChild className="mt-2 px-0">
          <Link href="/restaurants">Voltar</Link>
        </Button>
      </div>
    );
  }

  const r = restaurantDetail;

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/restaurants">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Restaurantes
        </Link>
      </Button>

      <PageHeader
        icon={Store}
        title={r.name}
        description={[r.address, r.city, r.state].filter(Boolean).join(" · ")}
        action={
          <StatusBadge status={r.isActive ? "active" : "inactive"} />
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" /> Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{r.counts.employees}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" /> Cardápio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{r.counts.menuItems}</p>
            <p className="text-xs text-muted-foreground">
              {r.counts.menuItemsAvailable} disponíveis
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LayoutGrid className="h-4 w-4" /> Mesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{r.counts.tables}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Banknote className="h-4 w-4" /> Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {formatCurrency(r.counts.revenueToday)}
            </p>
            <p className="text-xs text-muted-foreground">
              {r.counts.openTabs} abertas · {r.counts.closedTabs} fechadas
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/menu?restaurantId=${r.id}`}>Ver cardápio</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/tables?restaurantId=${r.id}`}>Ver mesas</Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href={`/tabs?restaurantId=${r.id}`}>Ver comandas</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipe</CardTitle>
          <CardDescription>Funcionários vinculados ao restaurante</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {r.employees.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum funcionário.</p>
          ) : (
            r.employees.map((emp) => (
              <div
                key={emp.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{emp.name || emp.email}</p>
                  <p className="text-sm text-muted-foreground">{emp.email}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm">{roleLabels[emp.role] ?? emp.role}</p>
                  <StatusBadge status={emp.isActive ? "active" : "inactive"} />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

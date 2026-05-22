"use client";

import { useEffect } from "react";
import Link from "next/link";
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
import { Store, ChevronRight, Users, UtensilsCrossed, LayoutGrid, Receipt } from "lucide-react";

export default function RestaurantsPage() {
  const { restaurants, loading, fetchRestaurants } = useAdminData();

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <PageHeader
        icon={Store}
        title="Restaurantes"
        description="Todos os estabelecimentos cadastrados no UniHungry"
      />

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : restaurants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum restaurante cadastrado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {restaurants.map((r) => (
            <Card key={r.id} className="hover:border-primary/40 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{r.name}</CardTitle>
                    <CardDescription>
                      {[r.city, r.state].filter(Boolean).join(" - ") ||
                        "Localização não informada"}
                    </CardDescription>
                  </div>
                  <StatusBadge status={r.isActive ? "active" : "inactive"} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {r.employeesCount} funcionários
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <UtensilsCrossed className="h-4 w-4" />
                    {r.menuItemsCount ?? 0} itens
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LayoutGrid className="h-4 w-4" />
                    {r.tablesCount ?? 0} mesas
                  </div>
                  <div className="flex items-center gap-2 text-amber-600">
                    <Receipt className="h-4 w-4" />
                    {r.openTabsCount ?? 0} comandas abertas
                  </div>
                </div>
                {r.owner ? (
                  <p className="text-xs text-muted-foreground">
                    Gerente: {r.owner.name || r.owner.email}
                  </p>
                ) : null}
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/restaurants/${r.id}`}>
                    Ver detalhes
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

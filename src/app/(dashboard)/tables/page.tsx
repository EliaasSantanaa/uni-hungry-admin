"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAdminData } from "@/hooks/use-admin-data";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutGrid } from "lucide-react";
import { formatCurrency } from "@/lib/format";

export default function TablesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6 px-4 animate-pulse">Carregando...</div>}>
      <TablesPageContent />
    </Suspense>
  );
}

function TablesPageContent() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId") ?? undefined;
  const { restaurants, tables, loading, fetchRestaurants, fetchTables } =
    useAdminData();
  const [filterRestaurant, setFilterRestaurant] = useState<string>(
    restaurantId ?? "",
  );

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    void fetchTables(filterRestaurant || undefined);
  }, [filterRestaurant, fetchTables]);

  useEffect(() => {
    if (restaurantId) setFilterRestaurant(restaurantId);
  }, [restaurantId]);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <PageHeader
        icon={LayoutGrid}
        title="Mesas"
        description="Mesas cadastradas e status de ocupação"
      />

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Restaurante:
        </label>
        <select
          value={filterRestaurant}
          onChange={(e) => setFilterRestaurant(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Todos</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">
          {tables.length} mesas
        </span>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma mesa cadastrada.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tables.map((table) => (
            <Card key={table.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {table.name ||
                      (table.number != null ? `Mesa ${table.number}` : "Mesa")}
                  </CardTitle>
                  <StatusBadge status={table.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {table.restaurantName}
                  {table.capacity ? ` · ${table.capacity} lugares` : ""}
                </p>
              </CardHeader>
              <CardContent>
                {table.hasOpenTab && table.openTab ? (
                  <p className="text-sm text-amber-600 font-medium">
                    Comanda aberta · {formatCurrency(table.openTab.totalAmount)}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Sem comanda</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

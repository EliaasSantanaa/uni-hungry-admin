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
import { Receipt } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";

const TAB_STATUS_OPTIONS = [
  { value: "", label: "Todos os status" },
  { value: "OPEN", label: "Abertas" },
  { value: "CLOSED", label: "Fechadas" },
  { value: "CANCELLED", label: "Canceladas" },
];

const PAYMENT_LABELS: Record<string, string> = {
  CASH: "Dinheiro",
  DEBIT_CARD: "Débito",
  CREDIT_CARD: "Crédito",
};

export default function TabsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6 px-4 animate-pulse">Carregando...</div>}>
      <TabsPageContent />
    </Suspense>
  );
}

function TabsPageContent() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId") ?? undefined;
  const { restaurants, tabs, loading, fetchRestaurants, fetchTabs } =
    useAdminData();
  const [filterRestaurant, setFilterRestaurant] = useState<string>(
    restaurantId ?? "",
  );
  const [filterStatus, setFilterStatus] = useState<string>("");

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    void fetchTabs({
      restaurantId: filterRestaurant || undefined,
      status: filterStatus || undefined,
      limit: 100,
    });
  }, [filterRestaurant, filterStatus, fetchTabs]);

  useEffect(() => {
    if (restaurantId) setFilterRestaurant(restaurantId);
  }, [restaurantId]);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <PageHeader
        icon={Receipt}
        title="Comandas"
        description="Comandas abertas, fechadas e canceladas"
      />

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filterRestaurant}
          onChange={(e) => setFilterRestaurant(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Todos os restaurantes</option>
          {restaurants.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          {TAB_STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="text-sm text-muted-foreground">{tabs.length} comandas</span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : tabs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma comanda encontrada.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {tabs.map((tab) => (
            <Card key={tab.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-base flex items-center gap-2">
                      {tab.restaurant.name}
                      <span className="text-muted-foreground font-normal">
                        ·{" "}
                        {tab.table.name ||
                          (tab.table.number != null
                            ? `Mesa ${tab.table.number}`
                            : "Mesa")}
                      </span>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Aberta {formatDate(tab.openedAt)}
                      {tab.closedAt
                        ? ` · Fechada ${formatDate(tab.closedAt)}`
                        : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {tab.itemsCount} itens
                      {tab.paymentMethod
                        ? ` · ${PAYMENT_LABELS[tab.paymentMethod] ?? tab.paymentMethod}`
                        : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 sm:text-right">
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(tab.totalAmount)}
                    </p>
                    <StatusBadge status={tab.status} />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

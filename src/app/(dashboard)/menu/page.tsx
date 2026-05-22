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
import { UtensilsCrossed } from "lucide-react";
import { formatCurrency, MENU_CATEGORY_LABELS } from "@/lib/format";

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto py-6 px-4">
          <div className="animate-pulse h-8 w-48 bg-muted rounded mb-6" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  );
}

function MenuPageContent() {
  const searchParams = useSearchParams();
  const restaurantId = searchParams.get("restaurantId") ?? undefined;
  const { restaurants, menuItems, loading, fetchRestaurants, fetchMenuItems } =
    useAdminData();
  const [filterRestaurant, setFilterRestaurant] = useState<string>(
    restaurantId ?? "",
  );

  useEffect(() => {
    void fetchRestaurants();
  }, [fetchRestaurants]);

  useEffect(() => {
    void fetchMenuItems(filterRestaurant || undefined);
  }, [filterRestaurant, fetchMenuItems]);

  useEffect(() => {
    if (restaurantId) setFilterRestaurant(restaurantId);
  }, [restaurantId]);

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <PageHeader
        icon={UtensilsCrossed}
        title="Cardápio"
        description="Itens de menu de todos os restaurantes"
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
          {menuItems.length} itens
        </span>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : menuItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhum item no cardápio.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Card key={item.id}>
              <CardHeader className="py-3 px-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-base font-semibold truncate">
                      {item.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.restaurantName} ·{" "}
                      {MENU_CATEGORY_LABELS[item.category] ?? item.category}
                    </p>
                    {item.description ? (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <p className="font-bold text-primary">
                      {formatCurrency(item.price)}
                    </p>
                    <StatusBadge
                      status={item.isAvailable ? "active" : "inactive"}
                    />
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

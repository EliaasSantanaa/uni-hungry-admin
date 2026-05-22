"use client";

import { useCallback, useState } from "react";
import { dashboardApi } from "@/lib/api";
import {
  AdminMenuItem,
  AdminTab,
  AdminTable,
  RestaurantDetail,
  RestaurantOverview,
} from "@/types";
import { toast } from "sonner";

export function useAdminData() {
  const [restaurants, setRestaurants] = useState<RestaurantOverview[]>([]);
  const [restaurantDetail, setRestaurantDetail] =
    useState<RestaurantDetail | null>(null);
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [tables, setTables] = useState<AdminTable[]>([]);
  const [tabs, setTabs] = useState<AdminTab[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const res = await dashboardApi.getRestaurants();
      setRestaurants(res.data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao buscar restaurantes";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRestaurantById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const res = await dashboardApi.getRestaurantById(id);
      setRestaurantDetail(res.data);
      return res.data;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao buscar restaurante";
      toast.error(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenuItems = useCallback(async (restaurantId?: string) => {
    setLoading(true);
    try {
      const res = await dashboardApi.getMenuItems(restaurantId);
      setMenuItems(res.data.items);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao buscar cardápio";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTables = useCallback(async (restaurantId?: string) => {
    setLoading(true);
    try {
      const res = await dashboardApi.getTables(restaurantId);
      setTables(res.data.tables);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao buscar mesas";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTabs = useCallback(
    async (params?: { restaurantId?: string; status?: string; limit?: number }) => {
      setLoading(true);
      try {
        const res = await dashboardApi.getTabs(params);
        setTabs(res.data.tabs);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response
            ?.data?.message || "Erro ao buscar comandas";
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    restaurants,
    restaurantDetail,
    menuItems,
    tables,
    tabs,
    loading,
    fetchRestaurants,
    fetchRestaurantById,
    fetchMenuItems,
    fetchTables,
    fetchTabs,
  };
}

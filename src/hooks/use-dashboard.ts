"use client";

import { useState, useCallback } from "react";
import { dashboardApi } from "@/lib/api";
import { DashboardStats, RestaurantOverview } from "@/types";
import { toast } from "sonner";

export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [restaurants, setRestaurants] = useState<RestaurantOverview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar estatísticas
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getStats();
      setStats(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar estatísticas";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar restaurantes
  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardApi.getRestaurants();
      setRestaurants(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar restaurantes";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    restaurants,
    loading,
    error,
    fetchStats,
    fetchRestaurants,
  };
}

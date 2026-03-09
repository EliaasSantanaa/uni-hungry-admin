"use client";

import { useState, useCallback } from "react";
import {
  restaurantsApi,
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
  MyRestaurantResponse,
  MyRestaurantStatsResponse,
} from "@/lib/api";
import { toast } from "sonner";

export function useRestaurant() {
  const [restaurant, setRestaurant] = useState<MyRestaurantResponse | null>(
    null,
  );
  const [stats, setStats] = useState<MyRestaurantStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar meu restaurante
  const fetchMyRestaurant = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await restaurantsApi.getMyRestaurant();
      setRestaurant(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar restaurante";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar estatísticas do meu restaurante
  const fetchMyStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await restaurantsApi.getMyStats();
      setStats(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar estatísticas";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar restaurante
  const createRestaurant = useCallback(
    async (data: CreateRestaurantRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await restaurantsApi.create(data);
        toast.success(
          response.data.message || "Restaurante cadastrado com sucesso",
        );
        // Recarrega os dados
        await fetchMyRestaurant();
        await fetchMyStats();
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao cadastrar restaurante";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMyRestaurant, fetchMyStats],
  );

  // Atualizar restaurante
  const updateRestaurant = useCallback(
    async (id: string, data: UpdateRestaurantRequest) => {
      setLoading(true);
      setError(null);
      try {
        const response = await restaurantsApi.update(id, data);
        toast.success(
          response.data.message || "Restaurante atualizado com sucesso",
        );
        // Recarrega os dados
        await fetchMyRestaurant();
        await fetchMyStats();
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao atualizar restaurante";
        setError(errorMessage);
        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchMyRestaurant, fetchMyStats],
  );

  return {
    restaurant,
    stats,
    loading,
    error,
    fetchMyRestaurant,
    fetchMyStats,
    createRestaurant,
    updateRestaurant,
  };
}

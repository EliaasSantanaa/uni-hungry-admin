"use client";

import { useState, useCallback } from "react";
import { metricsApi, UserListItem, UserMetrics } from "@/lib/api";
import { toast } from "sonner";

export function useMetrics() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Buscar lista de usuários
  const fetchUsersList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await metricsApi.getUsersList();
      setUsers(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar usuários";
      setError(errorMessage);
      toast.error(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar métricas de um usuário
  const fetchUserMetrics = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await metricsApi.getUserMetrics(userId);
      setMetrics(response.data);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar métricas";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    metrics,
    loading,
    error,
    fetchUsersList,
    fetchUserMetrics,
  };
}

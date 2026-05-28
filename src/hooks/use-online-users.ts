"use client";

import { useCallback, useEffect, useState } from "react";
import { presenceApi } from "@/lib/api";
import { OnlineUser } from "@/types";
import { toast } from "sonner";

const REFRESH_INTERVAL_MS = 30_000;

export function useOnlineUsers(autoRefresh = true) {
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [total, setTotal] = useState(0);
  const [onlineThresholdMinutes, setOnlineThresholdMinutes] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOnlineUsers = useCallback(async (silent = false) => {
    if (!silent) {
      setLoading(true);
    }
    setError(null);

    try {
      const response = await presenceApi.getOnlineUsers();
      setUsers(response.data.users);
      setTotal(response.data.total);
      setOnlineThresholdMinutes(response.data.onlineThresholdMinutes);
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Erro ao buscar usuários online";
      setError(errorMessage);
      if (!silent) {
        toast.error(errorMessage);
      }
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchOnlineUsers();

    if (!autoRefresh) {
      return;
    }

    const intervalId = setInterval(() => {
      void fetchOnlineUsers(true);
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [autoRefresh, fetchOnlineUsers]);

  return {
    users,
    total,
    onlineThresholdMinutes,
    loading,
    error,
    refresh: fetchOnlineUsers,
  };
}

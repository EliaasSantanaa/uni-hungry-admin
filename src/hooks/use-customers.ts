"use client";

import { useState, useCallback } from "react";
import { usersApi, SignUpRequest, UpdateUserRequest } from "@/lib/api";
import { User } from "@/types";
import { toast } from "sonner";

export function useCustomers() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingAction, setIsLoadingAction] = useState(false);

  // Buscar todos os clientes
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersApi.getAll();
      setCustomers(response.data.users || response.data || []);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar clientes";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar novo cliente
  const createCustomer = useCallback(
    async (data: SignUpRequest) => {
      setIsLoadingAction(true);
      try {
        const response = await usersApi.create(data);
        toast.success(response.data.message || "Cliente criado com sucesso!");
        await fetchCustomers(); // Recarrega a lista
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao criar cliente";
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoadingAction(false);
      }
    },
    [fetchCustomers],
  );

  // Atualizar cliente existente
  const updateCustomer = useCallback(
    async (id: string, data: UpdateUserRequest) => {
      setIsLoadingAction(true);
      try {
        await usersApi.update(id, data);
        toast.success("Cliente atualizado com sucesso!");
        await fetchCustomers(); // Recarrega a lista
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao atualizar cliente";
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoadingAction(false);
      }
    },
    [fetchCustomers],
  );

  // Deletar cliente
  const deleteCustomer = useCallback(
    async (id: string) => {
      setIsLoadingAction(true);
      try {
        await usersApi.delete(id);
        toast.success("Cliente removido com sucesso!");
        await fetchCustomers(); // Recarrega a lista
        return true;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Erro ao remover cliente";
        toast.error(errorMessage);
        return false;
      } finally {
        setIsLoadingAction(false);
      }
    },
    [fetchCustomers],
  );

  // Buscar cliente específico
  const getCustomerById = useCallback(async (id: string) => {
    try {
      const response = await usersApi.getById(id);
      return response.data;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Erro ao buscar cliente";
      toast.error(errorMessage);
      return null;
    }
  }, []);

  return {
    customers,
    loading,
    error,
    isLoadingAction,
    fetchCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
  };
}

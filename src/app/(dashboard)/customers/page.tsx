"use client";

import { useEffect, useState } from "react";
import { useCustomers } from "@/hooks/use-customers";
import { CustomerDrawer } from "@/components/customers/customer-drawer";
import { CustomerFormData } from "@/types/forms";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/admin/status-badge";
import { User, UserRole } from "@/types";
import { UpdateUserRequest } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { Users, Plus, Mail, Phone, Shield, Eye } from "lucide-react";

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MANAGER]: "Gerente de Restaurante",
  [UserRole.USER]: "Usuário",
  [UserRole.WAITER]: "Garçom",
};

const roleColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-red-500/10 text-red-500 border-red-500/20",
  [UserRole.MANAGER]: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  [UserRole.USER]: "bg-green-500/10 text-green-500 border-green-500/20",
  [UserRole.WAITER]: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
};

export default function CustomersPage() {
  const { user: currentUser } = useAuth();
  const {
    customers,
    loading,
    isLoadingAction,
    fetchCustomers,
    createCustomer,
    updateCustomer,
  } = useCustomers();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleOpenDrawer = (customer?: User) => {
    setSelectedCustomer(customer || null);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedCustomer(null);
  };

  const handleSave = async (data: CustomerFormData): Promise<boolean> => {
    if (selectedCustomer) {
      const updateData: UpdateUserRequest = {
        name: data.name,
        phone: data.phone,
        role: data.role,
        restaurantId: data.restaurantId,
      };

      if (
        data.isActive !== undefined &&
        selectedCustomer.id !== currentUser?.id
      ) {
        updateData.isActive = data.isActive;
      }

      return await updateCustomer(selectedCustomer.id, updateData);
    }

    return await createCustomer(data);
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8" />
            Clientes
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie todos os clientes do sistema
          </p>
        </div>
        <Button onClick={() => handleOpenDrawer()} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Clientes</CardDescription>
            <CardTitle className="text-3xl">
              {loading ? <Skeleton className="h-9 w-16" /> : customers.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Ativos</CardDescription>
            <CardTitle className="text-3xl text-green-500">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                customers.filter((c) => c.isActive).length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Gerentes</CardDescription>
            <CardTitle className="text-3xl text-blue-500">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                customers.filter((c) => c.role === UserRole.MANAGER).length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Garçons</CardDescription>
            <CardTitle className="text-3xl text-yellow-500">
              {loading ? (
                <Skeleton className="h-9 w-16" />
              ) : (
                customers.filter((c) => c.role === UserRole.WAITER).length
              )}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            Clique em um cliente para editar suas informações e acesso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">
                Nenhum cliente cadastrado
              </h3>
              <p className="text-muted-foreground mt-2">
                Comece criando seu primeiro cliente
              </p>
              <Button onClick={() => handleOpenDrawer()} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Cliente
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Nome</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Telefone
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Função</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Cadastrado em
                    </th>
                    <th className="text-right py-3 px-4 font-medium w-12" />
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => handleOpenDrawer(customer)}
                      className="border-b hover:bg-muted/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4">
                        <StatusBadge
                          status={customer.isActive ? "active" : "inactive"}
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium">
                          {customer.name || "Sem nome"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          {customer.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {customer.phone ? (
                            <>
                              <Phone className="h-4 w-4" />
                              {customer.phone}
                            </>
                          ) : (
                            <span className="text-muted-foreground/50">-</span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${roleColors[customer.role]}`}
                        >
                          <Shield className="h-3 w-3" />
                          {roleLabels[customer.role]}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors inline-block" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <CustomerDrawer
        open={drawerOpen}
        onClose={handleCloseDrawer}
        onSave={handleSave}
        customer={selectedCustomer}
        isLoading={isLoadingAction}
        statusEditDisabled={selectedCustomer?.id === currentUser?.id}
      />
    </div>
  );
}

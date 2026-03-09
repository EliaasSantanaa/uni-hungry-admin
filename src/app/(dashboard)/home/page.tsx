"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useDashboard } from "@/hooks/use-dashboard";
import { useRestaurant } from "@/hooks/use-restaurant";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Store,
  UserCheck,
  Building,
  AlertCircle,
  Plus,
} from "lucide-react";
import { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.MANAGER]: "Gerente",
  [UserRole.USER]: "Usuário",
  [UserRole.WAITER]: "Garçom",
};

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading, fetchStats } = useDashboard();
  const {
    restaurant,
    stats: restaurantStats,
    loading: restaurantLoading,
    fetchMyRestaurant,
    fetchMyStats,
  } = useRestaurant();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      if (user.role === UserRole.ADMIN) {
        // ADMIN vê estatísticas gerais
        fetchStats();
      } else {
        // MANAGER/WAITER veem dados do restaurante
        fetchMyRestaurant();
        fetchMyStats();
      }
    }
  }, [user, authLoading, router, fetchStats, fetchMyRestaurant, fetchMyStats]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Renderização para ADMIN
  if (user.role === UserRole.ADMIN) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
              <p className="text-muted-foreground">
                Visão geral do sistema UniHungry
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    {stats?.totalCustomers || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.activeCustomers || 0} ativos
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Restaurantes
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    {stats?.totalRestaurants || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.activeRestaurants || 0} ativos
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    {stats?.customersByRole?.manager || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Proprietários de restaurantes
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Garçons</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <>
                  <div className="text-3xl font-bold">
                    {stats?.customersByRole?.waiter || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Funcionários ativos
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Customers */}
        {stats?.recentCustomers && stats.recentCustomers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Usuários Recentes</CardTitle>
              <CardDescription>
                Últimos usuários cadastrados no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {customer.email}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {roleLabels[customer.role as UserRole]}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Renderização para MANAGER/WAITER sem restaurante
  if (!restaurantLoading && restaurant && !restaurant.hasRestaurant) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        <Card className="border-yellow-500/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-yellow-500" />
              <div>
                <CardTitle>Restaurante não cadastrado</CardTitle>
                <CardDescription className="mt-2">
                  {restaurant.message}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {restaurant.canCreate ? (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Para começar a usar o sistema, você precisa cadastrar seu
                  restaurante. Clique no botão abaixo para iniciar o cadastro.
                </p>
                <Button
                  onClick={() => alert("Funcionalidade em desenvolvimento")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Meu Restaurante
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Entre em contato com o gerente do seu restaurante para vincular
                sua conta.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Renderização para MANAGER/WAITER com restaurante
  if (restaurantStats && restaurantStats.hasRestaurant) {
    return (
      <div className="container mx-auto py-6 px-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Building className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">
                {restaurantStats.restaurant?.name}
              </h1>
              <p className="text-muted-foreground">
                {restaurantStats.restaurant?.city &&
                restaurantStats.restaurant?.state
                  ? `${restaurantStats.restaurant.city} - ${restaurantStats.restaurant.state}`
                  : "Dashboard do Restaurante"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Funcionários
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {restaurantStats.stats?.totalEmployees || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {restaurantStats.stats?.activeEmployees || 0} ativos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Gerentes</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {restaurantStats.stats?.managers || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Proprietários e administradores
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Garçons</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {restaurantStats.stats?.waiters || 0}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Funcionários no atendimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-lg font-bold ${restaurantStats.restaurant?.isActive ? "text-green-500" : "text-red-500"}`}
              >
                {restaurantStats.restaurant?.isActive ? "Ativo" : "Inativo"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Status do restaurante
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Employees */}
        {restaurantStats.recentEmployees &&
          restaurantStats.recentEmployees.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Funcionários Recentes</CardTitle>
                <CardDescription>
                  Últimos funcionários cadastrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {restaurantStats.recentEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {employee.email}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {roleLabels[employee.role as UserRole]}
                        </p>
                        <p
                          className={`text-xs ${employee.isActive ? "text-green-500" : "text-red-500"}`}
                        >
                          {employee.isActive ? "Ativo" : "Inativo"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
    );
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

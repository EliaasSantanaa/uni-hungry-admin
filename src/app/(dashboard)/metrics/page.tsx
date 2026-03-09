"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useMetrics } from "@/hooks/use-metrics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  Users,
  Building,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Mail,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
import { UserRole } from "@/types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const roleLabels: Record<string, string> = {
  ADMIN: "Administrador",
  MANAGER: "Gerente",
  WAITER: "Garçom",
  USER: "Usuário",
};

export default function MetricsPage() {
  const { user } = useAuth();
  const { users, metrics, loading, fetchUsersList, fetchUserMetrics } =
    useMetrics();
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      fetchUsersList();
    }
  }, [user, fetchUsersList]);

  const handleUserChange = async (userId: string) => {
    setSelectedUserId(userId);
    if (userId) {
      await fetchUserMetrics(userId);
    }
  };

  // Apenas ADMIN pode acessar
  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="container mx-auto py-6 px-4">
        <Card className="border-red-500/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <div>
                <CardTitle>Acesso Negado</CardTitle>
                <CardDescription>
                  Apenas administradores podem acessar métricas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Métricas Detalhadas</h1>
            <p className="text-muted-foreground">
              Visualize estatísticas e gráficos de usuários e restaurantes
            </p>
          </div>
        </div>

        {/* Select de Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Selecione um Usuário</CardTitle>
            <CardDescription>
              Escolha um usuário para visualizar suas métricas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <select
              value={selectedUserId}
              onChange={(e) => handleUserChange(e.target.value)}
              className="w-full p-3 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              <option value="">Selecione um usuário...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} - {user.email} ({roleLabels[user.role]})
                  {user.hasRestaurant && ` - ${user.restaurantName}`}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {/* Loading */}
      {loading && selectedUserId && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Métricas do Usuário */}
      {!loading && metrics && (
        <>
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Informações do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      {metrics.user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <UserCheck className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Tipo</p>
                    <p className="text-sm text-muted-foreground">
                      {roleLabels[metrics.user.role]}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Cadastrado em</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(metrics.user.createdAt).toLocaleDateString(
                        "pt-BR",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sem restaurante */}
          {!metrics.hasRestaurant && (
            <Card className="border-yellow-500/50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                  <div>
                    <CardTitle>Sem Restaurante</CardTitle>
                    <CardDescription>{metrics.message}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )}

          {/* Com restaurante */}
          {metrics.hasRestaurant && metrics.restaurant && (
            <>
              {/* Restaurant Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    {metrics.restaurant.name}
                  </CardTitle>
                  <CardDescription>Informações do restaurante</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {metrics.restaurant.city && metrics.restaurant.state && (
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Localização</p>
                          <p className="text-sm text-muted-foreground">
                            {metrics.restaurant.city} -{" "}
                            {metrics.restaurant.state}
                          </p>
                        </div>
                      </div>
                    )}
                    {metrics.restaurant.phone && (
                      <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Telefone</p>
                          <p className="text-sm text-muted-foreground">
                            {metrics.restaurant.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Status</p>
                        <p
                          className={`text-sm font-medium ${metrics.restaurant.isActive ? "text-green-500" : "text-red-500"}`}
                        >
                          {metrics.restaurant.isActive ? "Ativo" : "Inativo"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              {metrics.stats && (
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
                        {metrics.stats.totalEmployees}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {metrics.stats.activeEmployees} ativos
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Gerentes
                      </CardTitle>
                      <UserCheck className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-500">
                        {metrics.stats.managers}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Proprietários
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Garçons
                      </CardTitle>
                      <Users className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-yellow-500">
                        {metrics.stats.waiters}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Funcionários
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        Taxa de Atividade
                      </CardTitle>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-500">
                        {Math.round(
                          (metrics.stats.activeEmployees /
                            metrics.stats.totalEmployees) *
                            100,
                        )}
                        %
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Funcionários ativos
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Charts */}
              {metrics.charts && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart - Funcionários por Mês */}
                  {metrics.charts.employeesByMonth.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Cadastros por Mês</CardTitle>
                        <CardDescription>
                          Evolução de funcionários cadastrados
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={metrics.charts.employeesByMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="ativos"
                              fill="#22c55e"
                              name="Ativos"
                            />
                            <Bar
                              dataKey="inativos"
                              fill="#ef4444"
                              name="Inativos"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  {/* Pie Chart - Distribuição por Tipo */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição por Tipo</CardTitle>
                      <CardDescription>Gerentes vs Garçons</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={metrics.charts.roleDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: any) => {
                              const {
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                percent,
                              } = props;
                              if (
                                !cx ||
                                !cy ||
                                midAngle === undefined ||
                                !innerRadius ||
                                !outerRadius ||
                                percent === undefined
                              )
                                return null;
                              const radius =
                                innerRadius + (outerRadius - innerRadius) * 0.5;
                              const x =
                                cx +
                                radius * Math.cos(-midAngle * (Math.PI / 180));
                              const y =
                                cy +
                                radius * Math.sin(-midAngle * (Math.PI / 180));
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="white"
                                  textAnchor={x > cx ? "start" : "end"}
                                  dominantBaseline="central"
                                  className="text-sm font-bold"
                                >
                                  {`${(percent * 100).toFixed(0)}%`}
                                </text>
                              );
                            }}
                            outerRadius={100}
                            dataKey="value"
                          >
                            {metrics.charts.roleDistribution.map(
                              (entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ),
                            )}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Pie Chart - Status */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Status dos Funcionários</CardTitle>
                      <CardDescription>Ativos vs Inativos</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={metrics.charts.statusDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(props: any) => {
                              const {
                                cx,
                                cy,
                                midAngle,
                                innerRadius,
                                outerRadius,
                                percent,
                              } = props;
                              if (
                                !cx ||
                                !cy ||
                                midAngle === undefined ||
                                !innerRadius ||
                                !outerRadius ||
                                percent === undefined
                              )
                                return null;
                              const radius =
                                innerRadius + (outerRadius - innerRadius) * 0.5;
                              const x =
                                cx +
                                radius * Math.cos(-midAngle * (Math.PI / 180));
                              const y =
                                cy +
                                radius * Math.sin(-midAngle * (Math.PI / 180));
                              return (
                                <text
                                  x={x}
                                  y={y}
                                  fill="white"
                                  textAnchor={x > cx ? "start" : "end"}
                                  dominantBaseline="central"
                                  className="text-sm font-bold"
                                >
                                  {`${(percent * 100).toFixed(0)}%`}
                                </text>
                              );
                            }}
                            outerRadius={100}
                            dataKey="value"
                          >
                            {metrics.charts.statusDistribution.map(
                              (entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ),
                            )}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recent Employees */}
              {metrics.recentEmployees &&
                metrics.recentEmployees.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Funcionários Recentes</CardTitle>
                      <CardDescription>
                        Últimos funcionários cadastrados no restaurante
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {metrics.recentEmployees.map((employee) => (
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
                                {roleLabels[employee.role]}
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
            </>
          )}
        </>
      )}

      {/* Empty State */}
      {!loading && !selectedUserId && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              Selecione um usuário para visualizar suas métricas
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

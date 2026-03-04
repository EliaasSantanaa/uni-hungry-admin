import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema UniHungry
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Pedidos
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Produtos Ativos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">456</div>
            <p className="text-xs text-muted-foreground">
              +12 novos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">+180 novos este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Pedidos Recentes</CardTitle>
            <CardDescription>
              Últimos pedidos realizados no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  id: "#1234",
                  customer: "João Silva",
                  value: "R$ 45,00",
                  status: "Entregue",
                  icon: CheckCircle,
                  color: "text-green-600",
                },
                {
                  id: "#1235",
                  customer: "Maria Santos",
                  value: "R$ 32,00",
                  status: "Em preparo",
                  icon: Clock,
                  color: "text-yellow-600",
                },
                {
                  id: "#1236",
                  customer: "Pedro Costa",
                  value: "R$ 28,50",
                  status: "Pendente",
                  icon: Clock,
                  color: "text-orange-600",
                },
                {
                  id: "#1237",
                  customer: "Ana Oliveira",
                  value: "R$ 52,00",
                  status: "A caminho",
                  icon: TrendingUp,
                  color: "text-blue-600",
                },
              ].map((order) => {
                const Icon = order.icon;
                return (
                  <div
                    key={order.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {order.customer}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{order.value}</span>
                      <div className="flex items-center gap-2">
                        <Icon className={`h-4 w-4 ${order.color}`} />
                        <span className="text-xs font-medium">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Produtos Populares</CardTitle>
            <CardDescription>
              Produtos mais vendidos esta semana
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "X-Burger Especial", sales: 234, trend: "+12%" },
                { name: "Pizza Margherita", sales: 189, trend: "+8%" },
                { name: "Coca-Cola 350ml", sales: 156, trend: "+15%" },
                { name: "Batata Frita", sales: 142, trend: "+5%" },
              ].map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sales} vendas
                    </p>
                  </div>
                  <span className="text-xs font-medium text-green-600">
                    {product.trend}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Pedidos Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">23</div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Aguardando confirmação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Pedidos Concluídos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">87</div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +12% em relação a ontem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Pedidos Cancelados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">5</div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              -2% em relação a ontem
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

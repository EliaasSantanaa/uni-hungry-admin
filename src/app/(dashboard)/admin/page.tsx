import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Package, ShoppingCart, Users } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Visão geral do sistema UniHungry
        </p>
      </div>

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
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231</div>
            <p className="text-xs text-muted-foreground">
              +15% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
      </div>

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
                },
                {
                  id: "#1235",
                  customer: "Maria Santos",
                  value: "R$ 32,00",
                  status: "Em preparo",
                },
                {
                  id: "#1236",
                  customer: "Pedro Costa",
                  value: "R$ 28,50",
                  status: "Pendente",
                },
                {
                  id: "#1237",
                  customer: "Ana Oliveira",
                  value: "R$ 52,00",
                  status: "A caminho",
                },
              ].map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {order.customer}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.id}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{order.value}</span>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-primary/10 text-primary">
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
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
                { name: "X-Burger Especial", sales: 234 },
                { name: "Pizza Margherita", sales: 189 },
                { name: "Coca-Cola 350ml", sales: 156 },
                { name: "Batata Frita", sales: 142 },
              ].map((product) => (
                <div
                  key={product.name}
                  className="flex items-center justify-between"
                >
                  <p className="text-sm font-medium">{product.name}</p>
                  <span className="text-sm text-muted-foreground">
                    {product.sales} vendas
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

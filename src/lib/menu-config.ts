import {
  Settings,
  Home,
  Users,
  LucideIcon,
  BarChart3,
  Store,
  UtensilsCrossed,
  LayoutGrid,
  Receipt,
  Radio,
} from "lucide-react";

export interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  items?: MenuItem[];
}

export interface MenuGroup {
  label?: string;
  items: MenuItem[];
}

export const menuConfig: MenuGroup[] = [
  {
    label: "Geral",
    items: [
      { title: "Dashboard", href: "/home", icon: Home },
      { title: "Usuários Online", href: "/online-users", icon: Radio },
      { title: "Usuários", href: "/customers", icon: Users },
      { title: "Métricas", href: "/metrics", icon: BarChart3 },
    ],
  },
  {
    label: "Operações",
    items: [
      { title: "Restaurantes", href: "/restaurants", icon: Store },
      { title: "Cardápio", href: "/menu", icon: UtensilsCrossed },
      { title: "Mesas", href: "/tables", icon: LayoutGrid },
      { title: "Comandas", href: "/tabs", icon: Receipt },
    ],
  },
  {
    label: "Sistema",
    items: [{ title: "Configurações", href: "/settings", icon: Settings }],
  },
];

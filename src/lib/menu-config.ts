import { Settings, Home, Users, LucideIcon, BarChart3 } from "lucide-react";

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
    label: "Menu",
    items: [
      {
        title: "Dashboard",
        href: "/home",
        icon: Home,
      },
      {
        title: "Usuários",
        href: "/customers",
        icon: Users,
      },
      {
        title: "Métricas",
        href: "/metrics",
        icon: BarChart3,
      },
      {
        title: "Configurações",
        href: "/settings",
        icon: Settings,
      },
    ],
  },
];

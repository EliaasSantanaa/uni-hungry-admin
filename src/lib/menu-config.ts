import {
  Package,
  ShoppingCart,
  Settings,
  Home,
  LucideIcon,
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
    label: "Opções",
    items: [
      {
        title: "Home",
        href: "/home",
        icon: Home,
      },
      {
        title: "Admin",
        href: "/admin",
        icon: Settings,
      },
      {
        title: "Pedidos",
        href: "/orders",
        icon: ShoppingCart,
        badge: "12",
      },
      {
        title: "Produtos",
        href: "/products",
        icon: Package,
      },
    ],
  },
];

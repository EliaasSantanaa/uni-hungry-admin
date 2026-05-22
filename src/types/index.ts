// Enums
export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  WAITER = "WAITER",
  USER = "USER",
}

// User Types
export interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  restaurantId?: string;
  createdAt: string;
  updatedAt: string;
  restaurant?: Restaurant;
}

// Restaurant Types
export interface Restaurant {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  user: User;
}

export interface CurrentUser {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  restaurantId?: string;
  restaurant?: Restaurant;
}

// Dashboard Types
export interface DashboardOperations {
  totalMenuItems: number;
  availableMenuItems: number;
  totalTables: number;
  openTabs: number;
  closedTabsToday: number;
  cancelledTabsToday: number;
  revenueToday: number;
}

export interface DashboardStats {
  totalCustomers: number;
  activeCustomers: number;
  inactiveCustomers: number;
  totalEmployees: number;
  totalRestaurants: number;
  activeRestaurants: number;
  customersByRole: {
    admin: number;
    manager: number;
    waiter: number;
    user: number;
  };
  recentCustomers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
  }>;
  operations: DashboardOperations;
}

export interface RestaurantOverview {
  id: string;
  name: string;
  city?: string;
  state?: string;
  isActive: boolean;
  employeesCount: number;
  activeEmployees: number;
  menuItemsCount?: number;
  tablesCount?: number;
  openTabsCount?: number;
  owner?: User;
  createdAt: string;
}

export interface RestaurantDetail {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  counts: {
    employees: number;
    menuItems: number;
    menuItemsAvailable: number;
    tables: number;
    openTabs: number;
    closedTabs: number;
    revenueToday: number;
  };
  employees: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  }>;
}

export interface AdminMenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  imageUrl?: string;
  restaurantId: string;
  restaurantName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTable {
  id: string;
  number: number | null;
  name: string | null;
  capacity: number | null;
  status: string;
  restaurantId: string;
  restaurantName: string;
  hasOpenTab: boolean;
  openTab: {
    id: string;
    totalAmount: number;
    openedAt: string;
  } | null;
  createdAt: string;
}

export interface AdminTab {
  id: string;
  status: string;
  subtotal: number;
  serviceCharge: number;
  totalAmount: number;
  paymentMethod: string | null;
  note: string | null;
  itemsCount: number;
  openedAt: string;
  closedAt: string | null;
  table: { id: string; number: number | null; name: string | null };
  restaurant: { id: string; name: string };
}

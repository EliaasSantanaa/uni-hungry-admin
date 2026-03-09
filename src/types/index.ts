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
}

export interface RestaurantOverview {
  id: string;
  name: string;
  city?: string;
  state?: string;
  isActive: boolean;
  employeesCount: number;
  activeEmployees: number;
  owner?: User;
  createdAt: string;
}

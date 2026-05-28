import axios from "axios";
import {
  User,
  UserRole,
  LoginResponse,
  DashboardStats,
  RestaurantOverview,
  RestaurantDetail,
  AdminMenuItem,
  AdminTable,
  AdminTab,
  OnlineUsersResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos para as requisições de autenticação
export interface SignInRequest {
  email: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  code: string;
}

export interface SignUpRequest {
  email: string;
  name?: string;
  phone?: string;
  role?: UserRole;
  restaurantId?: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  user?: User;
}

export interface UpdateUserRequest {
  name?: string;
  phone?: string;
  role?: UserRole;
  isActive?: boolean;
  restaurantId?: string;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
}

// Funções de autenticação
export const authApi = {
  signIn: (data: SignInRequest) =>
    api.post<SignInResponse>("/auth/sign-in", data),

  verifyOtp: (data: VerifyOtpRequest) =>
    api.post<LoginResponse>("/auth/verify-otp", data),

  signUp: (data: SignUpRequest) =>
    api.post<SignUpResponse>("/auth/sign-up", data),
};

// Funções de gerenciamento de usuários
export const usersApi = {
  getAll: () => api.get<GetUsersResponse>("/users"),

  getById: (id: string) => api.get<User>(`/users/${id}`),

  create: (data: SignUpRequest) => authApi.signUp(data),

  update: (id: string, data: UpdateUserRequest) =>
    api.patch<User>(`/users/${id}`, data),

  delete: (id: string) => api.delete(`/users/${id}`),
};

// Funções de dashboard (ADMIN)
export const dashboardApi = {
  getStats: () => api.get<DashboardStats>("/dashboard/stats"),

  getRestaurants: () => api.get<RestaurantOverview[]>("/dashboard/restaurants"),

  getRestaurantById: (id: string) =>
    api.get<RestaurantDetail>(`/dashboard/restaurants/${id}`),

  getMenuItems: (restaurantId?: string) =>
    api.get<{ total: number; items: AdminMenuItem[] }>("/dashboard/menu-items", {
      params: restaurantId ? { restaurantId } : undefined,
    }),

  getTables: (restaurantId?: string) =>
    api.get<{ total: number; tables: AdminTable[] }>("/dashboard/tables", {
      params: restaurantId ? { restaurantId } : undefined,
    }),

  getTabs: (params?: {
    restaurantId?: string;
    status?: string;
    limit?: number;
  }) =>
    api.get<{ total: number; tabs: AdminTab[] }>("/dashboard/tabs", {
      params,
    }),

  getTabById: (id: string) => api.get(`/dashboard/tabs/${id}`),
};

export const presenceApi = {
  getOnlineUsers: () => api.get<OnlineUsersResponse>("/presence/online"),
};

// Tipos para restaurantes
export interface CreateRestaurantRequest {
  name: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface UpdateRestaurantRequest {
  name?: string;
  cnpj?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isActive?: boolean;
}

export interface RestaurantStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  managers: number;
  waiters: number;
}

export interface MyRestaurantResponse {
  hasRestaurant: boolean;
  message?: string;
  canCreate?: boolean;
  restaurant?: {
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
  };
}

export interface MyRestaurantStatsResponse {
  hasRestaurant: boolean;
  restaurant?: {
    id: string;
    name: string;
    city?: string;
    state?: string;
    isActive: boolean;
  };
  stats?: RestaurantStats;
  recentEmployees?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  }>;
}

// Funções de restaurantes
export const restaurantsApi = {
  // Buscar meu restaurante
  getMyRestaurant: () => api.get<MyRestaurantResponse>("/restaurants/me"),

  // Buscar estatísticas do meu restaurante
  getMyStats: () => api.get<MyRestaurantStatsResponse>("/restaurants/me/stats"),

  // Criar restaurante
  create: (data: CreateRestaurantRequest) =>
    api.post<{ success: boolean; message: string; restaurant: any }>(
      "/restaurants",
      data,
    ),

  // Buscar por ID
  getById: (id: string) => api.get(`/restaurants/${id}`),

  // Atualizar
  update: (id: string, data: UpdateRestaurantRequest) =>
    api.patch<{ success: boolean; message: string; restaurant: any }>(
      `/restaurants/${id}`,
      data,
    ),
};

// Tipos para métricas
export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: string;
  restaurantName: string;
  hasRestaurant: boolean;
}

export interface UserMetrics {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  };
  hasRestaurant: boolean;
  message?: string;
  restaurant?: {
    id: string;
    name: string;
    cnpj?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    isActive: boolean;
    createdAt: string;
  };
  stats?: {
    totalEmployees: number;
    activeEmployees: number;
    inactiveEmployees: number;
    managers: number;
    waiters: number;
  };
  charts?: {
    employeesByMonth: Array<{
      month: string;
      ativos: number;
      inativos: number;
      total: number;
    }>;
    roleDistribution: Array<{
      name: string;
      value: number;
      fill: string;
    }>;
    statusDistribution: Array<{
      name: string;
      value: number;
      fill: string;
    }>;
  };
  recentEmployees?: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  }>;
}

// Funções de métricas
export const metricsApi = {
  // Buscar lista de usuários
  getUsersList: () => api.get<UserListItem[]>("/metrics/users-list"),

  // Buscar métricas de um usuário
  getUserMetrics: (userId: string) =>
    api.get<UserMetrics>(`/metrics/user/${userId}`),
};

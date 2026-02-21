import axios from "axios";

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

// Tipos para as requisições
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

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  session?: {
    access_token: string;
    refresh_token?: string;
    user: {
      id: string;
      email: string;
      role: string;
      user_metadata?: {
        name?: string;
      };
    };
  };
}

// Funções de autenticação
export const authApi = {
  signIn: (data: SignInRequest) =>
    api.post<SignInResponse>("/auth/sign-in", data),

  verifyOtp: (data: VerifyOtpRequest) =>
    api.post<VerifyOtpResponse>("/auth/verify-otp", data),
};

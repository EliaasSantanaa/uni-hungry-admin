"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import { CurrentUser, UserRole } from "@/types";

interface AuthContextType {
  user: CurrentUser | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (
    email: string,
    code: string,
  ) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAdmin = user?.role === UserRole.ADMIN;

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        const parsedUser = JSON.parse(userData) as CurrentUser;

        // Valida que é ADMIN
        if (parsedUser.role !== UserRole.ADMIN) {
          await signOut();
          return;
        }

        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Error checking user:", error);
      await signOut();
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string) {
    try {
      const response = await authApi.signIn({ email });
      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao enviar código",
      };
    }
  }

  async function verifyOtp(email: string, code: string) {
    try {
      const response = await authApi.verifyOtp({ email, code });

      if (response.data.success && response.data.access_token) {
        const { access_token, user: userData } = response.data;

        // Valida que é ADMIN
        if (userData.role !== UserRole.ADMIN) {
          return {
            success: false,
            message: "Acesso restrito apenas para administradores",
          };
        }

        // Salva token e dados do usuário
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);

        // Redireciona para o dashboard
        router.replace("/home");

        return { success: true };
      }

      return {
        success: false,
        message: response.data.message || "Código inválido",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Erro ao verificar código",
      };
    }
  }

  async function signOut() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth/login");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        verifyOtp,
        signOut,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

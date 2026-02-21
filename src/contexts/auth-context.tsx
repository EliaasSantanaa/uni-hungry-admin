"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authApi, VerifyOtpResponse } from "@/lib/api";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyOtp: (
    email: string,
    code: string,
  ) => Promise<{ success: boolean; message?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verifica sessão inicial
    checkUser();

    // Escuta mudanças na autenticação do Supabase
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        await loadUserData(session.user);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        router.push("/auth/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  async function checkUser() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await loadUserData(session.user);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserData(supabaseUser: SupabaseUser) {
    try {
      // Busca dados adicionais do usuário do localStorage
      // (foram salvos durante o verifyOtp)
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        // Fallback: cria user básico com dados do Supabase
        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || "",
          role: "USER",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
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

      if (response.data.success && response.data.session) {
        const { session } = response.data;

        // Salva tokens
        localStorage.setItem("access_token", session.access_token);
        if (session.refresh_token) {
          localStorage.setItem("refresh_token", session.refresh_token);
        }

        // Salva dados do usuário
        if (session.user) {
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.name || "",
            role: session.user.role || "USER",
          };
          localStorage.setItem("user", JSON.stringify(userData));
          setUser(userData);
        }

        // Define sessão no Supabase (para sincronizar)
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token || "",
        });

        // Redireciona para o dashboard
        router.replace("/dashboard");

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
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      setUser(null);
      router.replace("/auth/login");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, verifyOtp, signOut }}>
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

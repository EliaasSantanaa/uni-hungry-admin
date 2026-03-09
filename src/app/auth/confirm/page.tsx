"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Info } from "lucide-react";

/**
 * Esta página não é mais utilizada.
 * O sistema agora cria usuários com email já confirmado.
 * Redirecionando para o login...
 */
export default function ConfirmEmailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para o login após 3 segundos
    const timer = setTimeout(() => {
      router.push("/auth/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative w-32 h-32">
            <Image
              src="/logo.png"
              alt="UniHungry Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground">UniHungry</h1>
        </div>

        {/* Card Informativo */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Sistema Atualizado
            </CardTitle>
            <CardDescription className="text-center">
              O processo de confirmação de email foi simplificado
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center space-y-6 py-8">
            {/* Ícone de Status */}
            <div className="relative">
              <Info className="h-16 w-16 text-primary animate-pulse" />
            </div>

            {/* Mensagem */}
            <div className="text-center space-y-2">
              <p className="text-lg font-medium text-muted-foreground">
                Esta página não é mais necessária
              </p>
              <p className="text-sm text-muted-foreground">
                Agora os usuários são criados com email já confirmado e podem
                fazer login imediatamente usando o código OTP.
              </p>
              <p className="text-sm text-primary font-medium mt-4">
                Redirecionando para o login...
              </p>
            </div>

            {/* Ação */}
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full"
            >
              Ir para o Login Agora
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          © 2026 UniHungry. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

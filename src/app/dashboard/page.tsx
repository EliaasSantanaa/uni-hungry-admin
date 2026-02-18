'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import Image from 'next/image'
import { LogOut, User, Mail, Shield } from 'lucide-react'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <Image
                src="/logo.png"
                alt="UniHungry Logo"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">UniHungry</h1>
              <p className="text-sm text-muted-foreground">Dashboard</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <Button onClick={signOut} variant="outline" size="sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Welcome Card */}
          <Card className="border-primary/20 bg-linear-to-br from-card to-primary/5">
            <CardHeader>
              <CardTitle className="text-2xl">
                Bem-vindo, {user.name || user.email}!
              </CardTitle>
              <CardDescription>
                Você está autenticado no sistema UniHungry
              </CardDescription>
            </CardHeader>
          </Card>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Informações do Usuário</CardTitle>
              <CardDescription>
                Seus dados de perfil e permissões
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nome</p>
                  <p className="text-base font-semibold">{user.name || 'Não informado'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-base font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Função</p>
                  <p className="text-base font-semibold">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                      {user.role}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <User className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ID</p>
                  <p className="font-mono text-sm">{user.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Card */}
          <Card>
            <CardHeader>
              <CardTitle>Em Desenvolvimento</CardTitle>
              <CardDescription>
                Novas funcionalidades em breve
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                O sistema está em desenvolvimento. Mais funcionalidades serão adicionadas em breve.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

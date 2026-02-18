'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

type Status = 'loading' | 'success' | 'error'

export default function ConfirmEmailPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Pega os tokens da URL
        const access_token = searchParams.get('access_token')
        const refresh_token = searchParams.get('refresh_token')
        const type = searchParams.get('type')

        // Verifica se é uma confirmação de signup
        if (type !== 'signup' && type !== 'email' && !access_token) {
          setStatus('error')
          setMessage('Link inválido ou expirado')
          return
        }

        if (access_token) {
          // Define a sessão com os tokens recebidos
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token: refresh_token || '',
          })

          if (error) {
            console.error('Error setting session:', error)
            setStatus('error')
            setMessage('Erro ao confirmar email. O link pode estar expirado.')
            return
          }
        }

        setStatus('success')
        setMessage('Email confirmado com sucesso!')

        // Redireciona após 3 segundos
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      } catch (error) {
        console.error('Error confirming email:', error)
        setStatus('error')
        setMessage('Erro ao confirmar email. Tente novamente.')
      }
    }

    confirmEmail()
  }, [searchParams, router])

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

        {/* Card de Status */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {status === 'loading' && 'Confirmando Email'}
              {status === 'success' && 'Email Confirmado!'}
              {status === 'error' && 'Erro na Confirmação'}
            </CardTitle>
            <CardDescription className="text-center">
              {status === 'loading' && 'Aguarde enquanto processamos sua confirmação...'}
              {status === 'success' && 'Sua conta foi ativada com sucesso'}
              {status === 'error' && 'Não foi possível confirmar seu email'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex flex-col items-center space-y-6 py-8">
            {/* Ícone de Status */}
            {status === 'loading' && (
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
            )}

            {status === 'success' && (
              <div className="relative">
                <CheckCircle2 className="h-16 w-16 text-primary animate-in zoom-in duration-500" />
                <div className="absolute inset-0 h-16 w-16 text-primary animate-ping opacity-75">
                  <CheckCircle2 className="h-16 w-16" />
                </div>
              </div>
            )}

            {status === 'error' && (
              <XCircle className="h-16 w-16 text-destructive animate-in zoom-in duration-500" />
            )}

            {/* Mensagem */}
            <div className="text-center space-y-2">
              <p className={`text-lg font-medium ${
                status === 'success' ? 'text-primary' : 
                status === 'error' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {message}
              </p>

              {status === 'success' && (
                <p className="text-sm text-muted-foreground">
                  Redirecionando para o login...
                </p>
              )}
            </div>

            {/* Ações */}
            {status === 'error' && (
              <div className="w-full space-y-2">
                <Button
                  onClick={() => router.push('/auth/login')}
                  className="w-full"
                >
                  Ir para o Login
                </Button>
              </div>
            )}

            {status === 'success' && (
              <Button
                onClick={() => router.push('/auth/login')}
                variant="outline"
                className="w-full"
              >
                Ir para o Login Agora
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          © 2026 UniHungry. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}

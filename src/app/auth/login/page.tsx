'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { OTPInput } from '@/components/otp-input'
import Image from 'next/image'
import { Loader2, Mail, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

type Step = 'email' | 'code'

export default function LoginPage() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { signIn, verifyOtp } = useAuth()

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const loadingToast = toast.loading('Enviando código...', {
      description: 'Aguarde um momento'
    })

    try {
      const result = await signIn(email)
      
      toast.dismiss(loadingToast)
      
      if (result.success) {
        toast.success('Código enviado!', {
          description: 'Verifique seu email',
          icon: '📧'
        })
        setStep('code')
      } else {
        toast.error('Erro ao enviar código', {
          description: result.message
        })
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Erro inesperado', {
        description: 'Tente novamente mais tarde'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCodeComplete = async (otpCode: string) => {
    if (loading) return
    
    setLoading(true)
    
    const loadingToast = toast.loading('Verificando código...', {
      description: 'Autenticando no sistema'
    })

    try {
      const result = await verifyOtp(email, otpCode)
      
      toast.dismiss(loadingToast)
      
      if (result.success) {
        toast.success('Bem-vindo!', {
          description: 'Autenticação realizada com sucesso',
          icon: '🎉'
        })
        // O AuthContext já faz o redirect
      } else {
        toast.error('Código inválido', {
          description: result.message || 'Verifique e tente novamente'
        })
        setCode('') // Limpa o código para permitir nova tentativa
        setLoading(false)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Erro ao verificar código', {
        description: 'Tente novamente'
      })
      setCode('')
      setLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setStep('email')
    setCode('')
    toast.info('Voltando ao email', {
      description: 'Digite seu email novamente'
    })
  }

  const handleResendCode = async () => {
    setLoading(true)
    
    const loadingToast = toast.loading('Reenviando código...', {
      description: 'Por favor aguarde'
    })

    try {
      const result = await signIn(email)
      
      toast.dismiss(loadingToast)
      
      if (result.success) {
        toast.success('Código reenviado!', {
          description: 'Verifique seu email novamente',
          icon: '✉️'
        })
      } else {
        toast.error('Erro ao reenviar', {
          description: result.message
        })
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error('Erro inesperado', {
        description: 'Tente novamente'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Logo */}
        <div className="flex flex-col items-center space-y-2">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 animate-in zoom-in duration-700">
            <Image
              src="/logo.png"
              alt="UniHungry Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-foreground animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
            UniHungry
          </h1>
          <p className="text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
            Sistema de Gestão Administrativa
          </p>
        </div>

        {/* Card de Login */}
        <Card className="border-border/50 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-700 delay-300">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              {step === 'email' ? (
                <>
                  <Sparkles className="h-6 w-6 text-primary" />
                  Bem-vindo
                </>
              ) : (
                <>
                  <Mail className="h-6 w-6 text-primary" />
                  Verificar Código
                </>
              )}
            </CardTitle>
            <CardDescription>
              {step === 'email' 
                ? 'Digite seu email para receber o código de acesso'
                : 'Digite o código de 6 dígitos enviado para seu email'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Passo 1: Email */}
            {step === 'email' && (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 transition-all"
                      required
                      disabled={loading}
                      autoFocus
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full group" 
                  disabled={loading || !email}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                      Enviar Código
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Passo 2: Código OTP */}
            {step === 'code' && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col items-center space-y-2">
                    <Label className="text-center">Código de Verificação</Label>
                    <p className="text-xs text-muted-foreground text-center">
                      Código enviado para <span className="font-medium text-primary">{email}</span>
                    </p>
                  </div>

                  <div className="py-4">
                    <OTPInput
                      length={6}
                      value={code}
                      onChange={setCode}
                      disabled={loading}
                      onComplete={handleCodeComplete}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span>Não recebeu o código?</span>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={loading}
                      className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                    >
                      Reenviar
                    </button>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={handleBackToEmail}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Voltar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
          © 2026 UniHungry. Todos os direitos reservados.
        </p>
      </div>
    </div>
  )
}

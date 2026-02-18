# 📝 Guia de Configuração - Supabase

Este guia explica como configurar o Supabase corretamente para o projeto UniHungry.

## 🔧 Configurações Necessárias

### 1. Variáveis de Ambiente (.env.local)

Copie suas chaves do Dashboard do Supabase:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

**Onde encontrar:**
- Acesse: Dashboard → Settings → API
- **Project URL** = NEXT_PUBLIC_SUPABASE_URL
- **anon/public** key = NEXT_PUBLIC_SUPABASE_ANON_KEY

---

### 2. Desabilitar Auto-cadastro

Para permitir apenas que admins criem usuários:

1. Vá em **Authentication** → **Providers**
2. Clique em **Email**
3. **Desative** a opção **"Enable email signup"**
4. Clique em **Save**

Agora apenas a Admin API (back-end) pode criar usuários.

---

### 3. Configurar SMTP (Resend)

Para enviar emails via Resend:

1. Vá em **Project Settings** → **Authentication** → **SMTP Settings**
2. Configure:
   - **Host**: \`smtp.resend.com\`
   - **Port**: \`587\` ou \`465\` (TLS)
   - **Username**: \`resend\`
   - **Password**: Sua API Key do Resend (ex: \`re_123456...\`)
   - **Sender email**: \`noreply@seu-dominio.com\`
   - **Sender name**: \`UniHungry\`
3. Clique em **Save**

**Observação:** Você precisa verificar seu domínio no Resend primeiro!

---

### 4. Configurar URLs de Redirecionamento

Para confirmação de email e callbacks:

1. Vá em **Authentication** → **URL Configuration**

2. **Site URL** (desenvolvimento):
   \`\`\`
   http://localhost:3001
   \`\`\`

3. **Redirect URLs** (adicione todas):
   \`\`\`
   http://localhost:3001/*
   http://localhost:3001/auth/confirm
   http://localhost:3001/auth/login
   \`\`\`

4. **Para produção**, adicione também:
   \`\`\`
   https://seu-dominio.com/*
   https://seu-dominio.com/auth/confirm
   https://seu-dominio.com/auth/login
   \`\`\`

5. Clique em **Save**

---

### 5. Personalizar Templates de Email

#### **Email de Confirmação de Conta**

1. Vá em **Authentication** → **Email Templates**
2. Selecione **Confirm signup**
3. Customize o HTML:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #3B82F6;
      font-size: 32px;
      margin: 0;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
    }
    .button {
      display: inline-block;
      background: #3B82F6;
      color: #ffffff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: background 0.2s;
    }
    .button:hover {
      background: #2563EB;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="logo">
    <h1>🍔 UniHungry</h1>
  </div>
  
  <div class="card">
    <h2 style="margin-top: 0;">Confirme sua conta</h2>
    <p>Olá! Bem-vindo ao UniHungry.</p>
    <p>Clique no botão abaixo para confirmar seu email e ativar sua conta:</p>
    
    <a href="{{ .ConfirmationURL }}" class="button">
      Confirmar Email
    </a>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
      Ou copie e cole este link no navegador:<br>
      <code style="background: #f3f4f6; padding: 8px; border-radius: 4px; display: inline-block; margin-top: 8px; word-break: break-all;">{{ .ConfirmationURL }}</code>
    </p>
  </div>
  
  <div class="footer">
    <p>Se você não criou esta conta, ignore este email.</p>
    <p>© 2026 UniHungry. Todos os direitos reservados.</p>
  </div>
</body>
</html>
\`\`\`

4. Clique em **Save**

#### **Email de Login OTP (Magic Link)**

1. Selecione **Magic Link**
2. Customize:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo h1 {
      color: #3B82F6;
      font-size: 32px;
      margin: 0;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 40px;
      text-align: center;
    }
    .code {
      font-size: 48px;
      font-weight: bold;
      color: #3B82F6;
      letter-spacing: 12px;
      font-family: 'Courier New', monospace;
      margin: 30px 0;
      padding: 20px;
      background: #f3f4f6;
      border-radius: 8px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #6b7280;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="logo">
    <h1>🍔 UniHungry</h1>
  </div>
  
  <div class="card">
    <h2 style="margin-top: 0;">Seu código de acesso</h2>
    <p>Use o código abaixo para fazer login no UniHungry:</p>
    
    <div class="code">{{ .Token }}</div>
    
    <p style="color: #dc2626; font-weight: 600;">Este código expira em 5 minutos.</p>
    
    <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
      Não compartilhe este código com ninguém.
    </p>
  </div>
  
  <div class="footer">
    <p>Se você não solicitou este código, ignore este email.</p>
    <p>© 2026 UniHungry. Todos os direitos reservados.</p>
  </div>
</body>
</html>
\`\`\`

3. Clique em **Save**

---

### 6. Configurar Tempo de Expiração do OTP

1. Vá em **Authentication** → **Email Templates**
2. Em **Settings**, você pode ajustar:
   - **OTP expiration**: Padrão é 3600 segundos (1 hora)
   - Recomendado: **300 segundos** (5 minutos)

---

### 7. Políticas de RLS (Row Level Security)

Se você estiver usando o banco do Supabase para usuários:

\`\`\`sql
-- Permitir que o service role (back-end) acesse tudo
CREATE POLICY "Service role bypass"
ON public.users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Usuários autenticados podem ler seus próprios dados
CREATE POLICY "Users can read own data"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);
\`\`\`

---

## ✅ Checklist de Configuração

- [ ] Variáveis de ambiente configuradas (.env.local)
- [ ] Auto-cadastro desabilitado
- [ ] SMTP configurado (Resend)
- [ ] URLs de redirecionamento adicionadas
- [ ] Templates de email personalizados
- [ ] Tempo de expiração do OTP ajustado
- [ ] Políticas RLS configuradas (se aplicável)

---

## 🔍 Testando a Configuração

### Teste 1: Criar Usuário (Backend)
\`\`\`bash
curl -X POST http://localhost:3000/auth/sign-up \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "teste@exemplo.com",
    "password": "senha123",
    "name": "Teste"
  }'
\`\`\`

**Esperado:** Email de confirmação enviado

### Teste 2: Confirmar Email
- Abra o email recebido
- Clique no botão de confirmação
- Deve redirecionar para: \`http://localhost:3001/auth/confirm\`
- Ver mensagem de sucesso

### Teste 3: Login OTP
1. Acesse \`http://localhost:3001\`
2. Digite o email confirmado
3. Clique em "Enviar Código"
4. Digite o código recebido por email
5. Deve entrar no dashboard

---

## 🆘 Troubleshooting

### Email não chega
- Verifique spam/lixeira
- Confirme SMTP configurado corretamente
- Teste API Key do Resend no dashboard deles
- Verifique logs do Supabase (Dashboard → Logs)

### Link de confirmação não funciona
- Verifique se a URL está nas Redirect URLs
- Confirme que o front-end está rodando na porta correta
- Verifique console do navegador para erros

### Código OTP inválido
- Verifique se o código não expirou (5 minutos)
- Confirme que está usando o código mais recente
- Verifique se o back-end está validando corretamente

---

## 📞 Suporte

Em caso de dúvidas, consulte:
- [Documentação do Supabase](https://supabase.com/docs)
- [Documentação do Resend](https://resend.com/docs)

---

© 2026 UniHungry

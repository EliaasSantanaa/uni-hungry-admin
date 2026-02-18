# UniHungry - Front-end (Admin)

Sistema de gestão administrativa do UniHungry com autenticação OTP via Supabase.

## 🚀 Funcionalidades Implementadas

✅ **Autenticação OTP**
- Login via email com código de 6 dígitos
- Integração com Supabase Auth
- Requisições ao back-end NestJS

✅ **Confirmação de Email**
- Página de confirmação automática
- Redirecionamento após confirmação

✅ **Gerenciamento de Tema**
- Dark mode como padrão
- Alternância entre dark/light mode
- Persistência da preferência

✅ **Design Responsivo**
- Layout minimalista e moderno
- Cor azul predominante (#3B82F6)
- Componentes shadcn/ui
- Totalmente responsivo

✅ **Dashboard**
- Exibição de informações do usuário
- Roles customizadas
- Logout funcional

## 📦 Instalação

1. **Instalar dependências:**
\`\`\`bash
npm install
\`\`\`

2. **Configurar variáveis de ambiente:**

Crie o arquivo \`.env.local\` na raiz com:

\`\`\`env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

3. **Rodar o projeto:**
\`\`\`bash
npm run dev
\`\`\`

Acesse: http://localhost:3001

## 🏗️ Estrutura do Projeto

\`\`\`
src/
├── app/
│   ├── auth/
│   │   ├── login/          # Página de login OTP
│   │   └── confirm/        # Confirmação de email
│   ├── dashboard/          # Dashboard após login
│   ├── layout.tsx          # Layout principal com providers
│   └── page.tsx            # Página inicial (redireciona)
├── components/
│   ├── ui/                 # Componentes shadcn
│   └── theme-toggle.tsx    # Toggle de tema
├── contexts/
│   ├── auth-context.tsx    # Context de autenticação
│   └── theme-context.tsx   # Context de tema
└── lib/
    ├── api.ts              # Cliente HTTP (axios)
    ├── supabase.ts         # Cliente Supabase
    └── utils.ts            # Utilitários
\`\`\`

## 🎨 Tema e Cores

O projeto usa um tema personalizado com:
- **Primary**: Azul (#3B82F6)
- **Background (dark)**: #1A1A1A
- **Background (light)**: #FFFFFF
- Personalização via \`globals.css\`

## 🔐 Fluxo de Autenticação

1. Usuário acessa a aplicação → redireciona para \`/auth/login\`
2. Digita o email → back-end envia código OTP
3. Digita o código → back-end valida
4. Autenticado → redireciona para \`/dashboard\`

## 📝 Confirmação de Email (Novo Usuário)

1. Admin cria usuário no back-end
2. Usuário recebe email de confirmação
3. Clica no link → redireciona para \`/auth/confirm\`
4. Supabase processa confirmação
5. Usuário pode fazer login

## 🛠️ Tecnologias

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui**
- **Supabase** (Auth)
- **Axios** (HTTP Client)
- **Lucide React** (Ícones)

## 📱 Responsividade

O design é totalmente responsivo e funciona em:
- 📱 Mobile (320px+)
- 💻 Tablet (768px+)
- 🖥️ Desktop (1024px+)

## 🔒 Segurança

- Tokens armazenados no localStorage
- Sessões gerenciadas pelo Supabase
- Proteção de rotas via AuthContext
- HTTPS recomendado em produção

## 🚀 Deploy

Para produção, atualize as variáveis de ambiente:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-key-de-producao
NEXT_PUBLIC_API_URL=https://api.unihungry.com
\`\`\`

E no Supabase:
- Configure a **Site URL** para seu domínio
- Adicione as **Redirect URLs** permitidas

## 📖 Próximos Passos

- [ ] Adicionar mais páginas (pedidos, produtos, etc)
- [ ] Implementar gerenciamento de usuários
- [ ] Adicionar gráficos e analytics
- [ ] Implementar sistema de notificações
- [ ] Adicionar testes automatizados

## 👨‍💻 Desenvolvido por

Elias Santana Santos

---

© 2026 UniHungry. Todos os direitos reservados.

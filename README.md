# Uni Hungry — Admin

Painel web administrativo do **Uni Hungry**, plataforma de gestão de restaurantes universitários. Permite que administradores gerenciem usuários, restaurantes, cardápios, mesas, comandas e métricas do sistema.

> Parte do ecossistema Uni Hungry: consome a API [`uni-hungry-server`](../uni-hungry-server) e complementa o app mobile [`uni-hungry-app`](../uni-hungry-app).

---

## Equipe

| Nome | RA |
|---|---|
| Elias Santana Santos | 97351 |
| Gabriel da Silva Araujo | 89655 |
| Nathan Rodrigues de Freitas | 98502 |
| Thiago de Almeida Brum | 95574 |

---

## Pré-requisitos

| Ferramenta | Versão |
|---|---|
| Node.js | 20+ |
| npm | 10+ |
| API Uni Hungry | Rodando em `http://localhost:3001` |

---

## Instalação

```bash
git clone https://github.com/EliaasSantanaa/uni-hungry-admin.git
cd uni-hungry-admin
npm install
```

### Variáveis de ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL base da API (`uni-hungry-server`) |

---

## Execução

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build
npm run start

# Lint
npm run lint
```

Acesse: **http://localhost:3000**

---

## Funcionalidades

- Autenticação OTP via API (apenas usuários com role `ADMIN`)
- Dashboard com estatísticas gerais
- Gestão de usuários e clientes
- Restaurantes, cardápio, mesas e comandas
- Métricas e usuários online
- Tema claro/escuro com persistência

---

## Estrutura do projeto

```
src/
├── app/
│   ├── auth/              # Login OTP e confirmação
│   └── (dashboard)/       # Páginas autenticadas
├── components/            # UI (shadcn/ui) e componentes admin
├── contexts/              # Auth e tema
├── hooks/                 # Hooks de dados (dashboard, métricas, etc.)
├── lib/                   # Cliente HTTP (axios) e utilitários
└── types/                 # Tipos TypeScript
```

---

## Autenticação

```
POST /auth/sign-in     → envia código OTP por e-mail
POST /auth/verify-otp  → valida o código e retorna JWT
```

O token é armazenado em `localStorage` e enviado automaticamente nas requisições autenticadas.

---

## Documentação adicional

- [FRONTEND_README.md](./FRONTEND_README.md) — detalhes de implementação do front-end
- [SUPABASE_CONFIG.md](./SUPABASE_CONFIG.md) — configuração do Supabase (auth e e-mail)

---

## Tecnologias

- Next.js 16 · React 19 · TypeScript
- Tailwind CSS 4 · shadcn/ui · Radix UI
- Axios · Recharts · Lucide React

---

## Licença

Projeto privado — todos os direitos reservados.

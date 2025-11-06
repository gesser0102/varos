# Varos - Sistema de Gestão de Consultores e Clientes

Sistema completo de gestão desenvolvido com **Next.js 16**, **TypeScript**, **Tailwind CSS** e **Prisma ORM**, implementando as melhores práticas modernas de desenvolvimento web com foco em performance, segurança e experiência do usuário.

---

## 📑 Índice

- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Arquitetura e Decisões Técnicas](#-arquitetura-e-decisões-técnicas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Setup](#-instalação-e-setup)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Schema do Banco de Dados](#-schema-do-banco-de-dados)
- [Cache e Performance](#-cache-e-performance)
- [Segurança](#-segurança)
- [Tratamento de Erros](#-tratamento-de-erros)
- [Deploy](#-deploy)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🚀 Tecnologias

### Core
- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router, Server Components e Server Actions
- **[TypeScript 5.9](https://www.typescriptlang.org/)** - Tipagem estática e type safety
- **[React 19](https://react.dev/)** - Biblioteca UI com React Server Components
- **[Tailwind CSS 3.4](https://tailwindcss.com/)** - Framework CSS utility-first

### Database & ORM
- **[Prisma ORM 6.18](https://www.prisma.io/)** - ORM type-safe para PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Supabase](https://supabase.com/)** - PostgreSQL hospedado com connection pooling

### Bibliotecas
- **[React Hook Form 7.66](https://react-hook-form.com/)** - Gerenciamento de formulários performático
- **[Zod 4.1](https://zod.dev/)** - Validação de schemas TypeScript-first
- **[date-fns 4.1](https://date-fns.org/)** - Manipulação de datas moderna
- **[Sonner 2.0](https://sonner.emilkowal.ski/)** - Toast notifications elegantes
- **[use-debounce 10.0](https://github.com/xnimorz/use-debounce)** - Debounce hooks otimizados

### Developer Experience
- **[ESLint 9](https://eslint.org/)** - Linting
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixes
- **[TSX](https://github.com/esbuild-kit/tsx)** - TypeScript execution para scripts

---

## 🎯 Funcionalidades

### Dashboard Principal
- ✅ **Métricas em tempo real** - Total de clientes e crescimento nos últimos 7 dias
- ✅ **Tabela interativa** - Lista completa de clientes com todos os dados
- ✅ **Filtros avançados** - Por consultor, email e período
- ✅ **Paginação otimizada** - 20 itens por página
- ✅ **Loading states** - Skeletons com Suspense boundaries
- ✅ **Navegação rápida** - Click em qualquer linha para editar

### Dashboard de Consultores
- ✅ **Estatísticas** - Total de consultores e crescimento
- ✅ **Tabela dedicada** - Visualização de todos os consultores
- ✅ **Gestão simplificada** - Criação e edição direta

### Gestão de Usuários
- ✅ **Criação de usuários** - Formulário completo para Cliente ou Consultor
- ✅ **Edição completa** - Atualização de todos os dados
- ✅ **Validação robusta** - Frontend e backend
- ✅ **Busca de CEP** - Integração com ViaCEP para auto-completar endereço
- ✅ **Relacionamentos** - Consultores podem vincular múltiplos clientes
- ✅ **Tabs organizadas** - Informações separadas em abas (Dados pessoais, Endereço)
- ✅ **Modal de confirmação** - Para ações críticas (atualizar, deletar)
- ✅ **Responsividade total** - Funciona perfeitamente em mobile e desktop

### User Experience
- ✅ **Toast notifications** - Feedback visual para todas as ações
- ✅ **Loading indicators** - Botões com estados de carregamento
- ✅ **Error handling** - Mensagens amigáveis para todos os erros
- ✅ **Navegação intuitiva** - Links de retorno e breadcrumbs
- ✅ **Design consistente** - Dark theme em toda aplicação

---

## 🏗️ Arquitetura e Decisões Técnicas

### 1. Next.js 16 App Router

**Por que App Router?**
- Server Components por padrão (menos JavaScript no cliente)
- Streaming SSR com Suspense (carregamento progressivo)
- Layouts compartilhados e nested routing
- Loading UI e Error Boundaries nativos
- Melhor SEO e performance

**Estrutura de rotas:**
```
app/
├── page.tsx                    # Redireciona para /dashboard
├── dashboard/                  # Dashboard de clientes
│   └── page.tsx               # Server Component
├── consultores/               # Dashboard de consultores
│   └── page.tsx
└── usuarios/
    ├── novo/                  # Criar usuário
    │   └── page.tsx
    └── [id]/editar/           # Editar usuário
        └── page.tsx
```

### 2. Server Components vs Client Components

#### Server Components (Padrão)
Usados para:
- Páginas principais ([dashboard/page.tsx](app/dashboard/page.tsx))
- Tabelas de dados ([ClientsTable.tsx](components/dashboard/ClientsTable.tsx))
- Cards de estatísticas ([ClientesStats.tsx](components/dashboard/ClientesStats.tsx))
- Headers e layouts

**Vantagens:**
- Zero JavaScript enviado ao cliente
- Acesso direto ao banco de dados
- Melhor SEO
- Performance otimizada

#### Client Components (`'use client'`)
Usados apenas quando necessário:
- Formulários com estado ([UserForm.tsx](components/users/UserForm.tsx))
- Filtros interativos ([DashboardFilters.tsx](components/dashboard/DashboardFilters.tsx))
- Modais ([ConfirmModal.tsx](components/ui/ConfirmModal.tsx))
- Components com hooks (useState, useEffect, etc)

### 3. Server Actions

**Localização:** [lib/actions/users.ts](lib/actions/users.ts)

```typescript
'use server'

export async function createUser(data: UserFormData) {
  // Proteção CSRF
  await validateCSRF()

  // Validação com Zod
  const validated = userSchema.parse(data)

  // Operação no banco
  await prisma.user.create({ data: validated })

  // Revalidação de cache
  revalidateTag('users')
  revalidatePath('/dashboard')
}
```

**Vantagens:**
- Type-safe mutations
- Sem necessidade de API routes
- Revalidação automática de cache
- Validação centralizada
- Proteção CSRF integrada

### 4. Streaming UI com Suspense

```typescript
<Suspense fallback={<TableSkeleton />}>
  <ClientsTable searchParams={searchParams} />
</Suspense>
```

**Fluxo:**
1. Next.js envia HTML inicial imediatamente
2. Suspense mostra skeleton enquanto dados carregam
3. Componente é hidratado progressivamente
4. UI atualiza sem reload

**Benefícios:**
- Time to First Byte (TTFB) < 200ms
- Perceived performance melhor
- Progressive Enhancement
- Melhor Core Web Vitals

### 5. Type Safety End-to-End

#### Prisma → TypeScript
```typescript
import { UserType } from '@prisma/client'

// Tipos gerados automaticamente pelo Prisma
type User = Prisma.UserGetPayload<{
  include: { consultorClients: true }
}>
```

#### Zod Validation
```typescript
const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  userType: z.enum(['CONSULTOR', 'CLIENTE'])
})
```

---

## 📋 Pré-requisitos

- **Node.js 18+** - [Download](https://nodejs.org/)
- **npm** ou **yarn** - Incluído com Node.js
- **Git** - [Download](https://git-scm.com/)
- **Conta Supabase** - [Criar conta gratuita](https://supabase.com)

---

## 🔧 Instalação e Setup

### 1. Clone o repositório

```bash
git clone https://github.com/gesser0102/varos.git
cd varos
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados (Supabase)

#### Criar projeto no Supabase:
1. Acesse [supabase.com](https://supabase.com) e faça login
2. Click em **"New Project"**
3. Preencha:
   - **Name:** varos (ou nome de sua preferência)
   - **Database Password:** Senha forte (guarde-a!)
   - **Region:** Escolha a região mais próxima
4. Click em **"Create new project"** e aguarde ~2 minutos

#### Obter connection strings:
1. No projeto criado, vá em **Settings** → **Database**
2. Role até **Connection string**
3. Copie as duas URLs:

**Connection Pooling (para DATABASE_URL):**
- Mode: `Transaction`
- URI format
- Exemplo: `postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

**Direct Connection (para DIRECT_URL):**
- URI format
- Exemplo: `postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o arquivo `.env` e substitua pelas suas URLs:

```env
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=20&pool_timeout=30"
DIRECT_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.pooler.supabase.com:6543/postgres"
```

**⚠️ Importante:**
- Substitua `[YOUR-PASSWORD]` pela senha criada no passo 3
- `DATABASE_URL` usa connection pooling (melhor performance)
- `DIRECT_URL` usa conexão direta (necessário para migrations)

### 5. Execute as migrations do Prisma

```bash
npx prisma migrate dev --name init
```

Isso criará todas as tabelas no banco de dados.

### 6. (Opcional) Popule o banco com dados de exemplo

```bash
npx prisma db seed
```

Isso criará:
- 3 consultores
- 7 clientes
- Relacionamentos entre eles

---

## 🚀 Executando o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: **[http://localhost:3000](http://localhost:3000)**

O servidor suporta:
- ✅ Hot Module Replacement (HMR)
- ✅ Fast Refresh
- ✅ Error overlay
- ✅ Turbopack (build ultra-rápido)

### Build para Produção

```bash
npm run build
npm start
```

---

## 📁 Estrutura do Projeto

```
varos/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Layout raiz da aplicação
│   ├── page.tsx               # Rota raiz (redireciona para /dashboard)
│   ├── globals.css            # Estilos globais + Tailwind
│   ├── error.tsx              # Error boundary global
│   ├── not-found.tsx          # Página 404 customizada
│   │
│   ├── dashboard/             # Dashboard de clientes
│   │   └── page.tsx          # Métricas + Tabela + Filtros
│   │
│   ├── consultores/           # Dashboard de consultores
│   │   └── page.tsx
│   │
│   └── usuarios/              # Gestão de usuários
│       ├── novo/
│       │   └── page.tsx      # Criar novo usuário
│       └── [id]/
│           └── editar/
│               └── page.tsx  # Editar usuário existente
│
├── components/                # React Components
│   ├── dashboard/            # Components do dashboard
│   │   ├── DashboardHeader.tsx        # Header com navegação
│   │   ├── DashboardFilters.tsx       # Filtros (Client Component)
│   │   ├── ClientsTable.tsx           # Tabela de clientes
│   │   ├── ConsultoresTable.tsx       # Tabela de consultores
│   │   ├── ClientesStats.tsx          # Card de métricas (clientes)
│   │   ├── ConsultoresStats.tsx       # Card de métricas (consultores)
│   │   ├── FilterOptions.tsx          # Opções de filtros
│   │   └── TableSkeleton.tsx          # Loading skeleton
│   │
│   ├── users/                # Components de usuários
│   │   ├── UserForm.tsx              # Formulário (Client Component)
│   │   ├── UserFormSkeleton.tsx      # Loading skeleton
│   │   ├── CreateUserForm.tsx        # Wrapper Server Component
│   │   ├── EditUserForm.tsx          # Wrapper Server Component
│   │   ├── CreateUserActions.tsx     # Botão de criar
│   │   └── EditUserActions.tsx       # Botões de atualizar/deletar
│   │
│   ├── ui/                   # UI Components reutilizáveis
│   │   ├── CustomSelect.tsx          # Select customizado
│   │   ├── LoadingLink.tsx           # Link com loading state
│   │   ├── ConfirmModal.tsx          # Modal de confirmação
│   │   └── Disclaimer.tsx            # Banner de informações
│   │
│   └── error/                # Error handling components
│       └── ErrorBoundary.tsx         # React Error Boundary
│
├── lib/                      # Bibliotecas e utilitários
│   ├── prisma.ts            # Prisma Client singleton
│   ├── csrf.ts              # Validação CSRF
│   ├── errors.ts            # Classes de erro customizadas
│   │
│   ├── actions/             # Server Actions
│   │   └── users.ts        # CRUD de usuários
│   │
│   ├── queries/             # Queries cacheadas
│   │   └── users.ts        # Queries de usuários com unstable_cache
│   │
│   └── services/            # Serviços externos
│       └── viacep.ts       # Integração ViaCEP
│
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   ├── seed.ts              # Script de seed
│   └── migrations/          # Histórico de migrations
│
├── public/                  # Assets estáticos
│
├── middleware.ts            # Middleware Next.js (CSRF, security headers)
├── next.config.ts           # Configuração Next.js
├── tailwind.config.ts       # Configuração Tailwind CSS
├── tsconfig.json            # Configuração TypeScript
├── postcss.config.mjs       # Configuração PostCSS
├── package.json             # Dependências e scripts
├── .env                     # Variáveis de ambiente (não commitar!)
├── .env.example             # Exemplo de variáveis
├── .gitignore               # Arquivos ignorados pelo Git
└── README.md                # Este arquivo
```

---

## 🗄️ Schema do Banco de Dados

### Model: User

Armazena tanto **Consultores** quanto **Clientes**:

```prisma
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  userType  UserType // ENUM: CONSULTOR | CLIENTE

  // Campos específicos para clientes
  cpf       String?  @unique
  age       Int?
  cep       String?
  state     String?
  address   String?
  complement String?

  // Relacionamentos
  consultorClients ConsultorClient[] @relation("Consultor")
  clientConsultors ConsultorClient[] @relation("Cliente")

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Índices de performance
  @@index([userType])
  @@index([createdAt])
  @@index([updatedAt])
  @@index([userType, createdAt])
  @@index([email, userType])
  @@index([name])
}
```

**Decisões de design:**
- **CUID** (Collision-resistant Unique ID) em vez de UUID - Mais curto e sortable
- **UserType ENUM** - Type safety garantido pelo banco
- **Email e CPF únicos** - Constraints para evitar duplicatas
- **Indexes estratégicos** - Otimização de queries frequentes (até 10x mais rápido)

### Model: ConsultorClient

Relacionamento **many-to-many** entre Consultores e Clientes:

```prisma
model ConsultorClient {
  id          String   @id @default(cuid())

  consultor   User     @relation("Consultor", fields: [consultorId], references: [id], onDelete: Cascade)
  consultorId String

  client      User     @relation("Cliente", fields: [clientId], references: [id], onDelete: Cascade)
  clientId    String

  createdAt   DateTime @default(now())

  @@unique([consultorId, clientId])  // Previne duplicatas
  @@index([consultorId])
  @@index([clientId])
}
```

**Decisões de design:**
- **Tabela de junção explícita** - Permite adicionar campos extras (ex: `createdAt`)
- **onDelete: Cascade** - Se um usuário for deletado, remove relacionamentos automaticamente
- **Unique constraint** - Um consultor não pode ser vinculado duas vezes ao mesmo cliente
- **Indexes bidirecionais** - Otimiza queries em ambas as direções

### Enum: UserType

```prisma
enum UserType {
  CONSULTOR
  CLIENTE
}
```

---

## ⚡ Cache e Performance

### Estratégia de Cache em Múltiplas Camadas

#### Layer 1: unstable_cache (Query-level)

Cacheia funções de data fetching:

```typescript
import { unstable_cache } from 'next/cache'

const getClients = unstable_cache(
  async (params) => {
    return await prisma.user.findMany({ ... })
  },
  ['clients-list'],
  {
    revalidate: 300,        // 5 minutos
    tags: ['users', 'clients']
  }
)
```

**Implementado em:**
- [lib/queries/users.ts](lib/queries/users.ts) - `getUserById()`, `getClientesList()`, `getConsultors()`
- [components/dashboard/ClientesStats.tsx](components/dashboard/ClientesStats.tsx) - `getTotalClientes()`
- [components/dashboard/ConsultoresStats.tsx](components/dashboard/ConsultoresStats.tsx) - `getTotalConsultores()`

**Configurações de revalidate:**
| Query | Revalidate | Motivo |
|-------|-----------|--------|
| Stats de clientes/consultores | 300s (5min) | Mudam com frequência |
| getUserById | 300s (5min) | Dados editáveis |
| getClientesList | 600s (10min) | Usada em dropdowns |
| getConsultors | 900s (15min) | Lista estável |

#### Layer 2: revalidateTag (On-demand)

Invalida caches específicos após mutations:

```typescript
// Em Server Actions
revalidateTag('users')      // Invalida todos caches com tag 'users'
revalidateTag('clients')
revalidateTag('stats')
```

**Tags implementadas:**
- `users` - Todos os dados de usuários
- `clients` - Específico para clientes
- `consultors` - Específico para consultores
- `stats` - Cards de métricas

#### Layer 3: revalidatePath (Route-level)

Invalida cache de páginas inteiras:

```typescript
revalidatePath('/dashboard')    // Revalida toda a página
revalidatePath('/consultores')
```

#### Layer 4: Page-level (ISR)

Cache de página com revalidação automática:

```typescript
// app/dashboard/page.tsx
export const revalidate = 60  // 1 minuto
```

**Páginas com ISR:**
- `/dashboard` - 60s
- `/consultores` - 60s

### Otimizações de Queries

#### 1. Select específico (ao invés de SELECT *)

```typescript
// ❌ ANTES: Buscava todos os campos
prisma.user.findMany()

// ✅ AGORA: Apenas campos necessários
prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
})
```

**Ganho:** 50-70% menos dados transferidos

#### 2. Queries em paralelo

```typescript
const [users, count] = await Promise.all([
  prisma.user.findMany({ where }),
  prisma.user.count({ where })
])
```

**Ganho:** 50% mais rápido que sequencial

#### 3. Connection Pooling (Supabase)

```env
DATABASE_URL="...?pgbouncer=true&connection_limit=20&pool_timeout=30"
```

**Benefícios:**
- Reutilização de conexões
- Melhor performance sob carga
- Previne connection exhaustion

### Métricas de Performance Esperadas

| Métrica | Valor | Como medir |
|---------|-------|-----------|
| TTFB (Time to First Byte) | < 200ms | Chrome DevTools Network |
| FCP (First Contentful Paint) | < 1s | Lighthouse |
| LCP (Largest Contentful Paint) | < 2.5s | Lighthouse |
| TTI (Time to Interactive) | < 3s | Lighthouse |
| Cache hit rate | > 80% | Logs do servidor |

### Monitorando Performance

```bash
# Prisma Studio - Visualizar dados
npx prisma studio

# Ver queries do Prisma
DEBUG="prisma:query" npm run dev

# Lighthouse audit
npm run build && npm start
# Abra Chrome DevTools → Lighthouse
```

---

## 🔒 Segurança

### 1. Proteção CSRF (Cross-Site Request Forgery)

#### Middleware de Validação de Origem

**Arquivo:** [middleware.ts](middleware.ts)

Valida a origem de todas as requisições que modificam estado:

```typescript
// Valida header 'origin' contra hosts permitidos
if (method !== 'GET' && method !== 'HEAD') {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  if (!isAllowedOrigin(origin, host)) {
    return new Response('Forbidden', { status: 403 })
  }
}
```

#### Validação em Server Actions

**Arquivo:** [lib/csrf.ts](lib/csrf.ts)

Todas as Server Actions que modificam dados incluem:

```typescript
await validateCSRF()  // Valida next-action header + origin
```

**Protegidas:**
- ✅ `createUser()` - [lib/actions/users.ts:24](lib/actions/users.ts#L24)
- ✅ `updateUser()` - [lib/actions/users.ts:87](lib/actions/users.ts#L87)
- ✅ `deleteUser()` - [lib/actions/users.ts:164](lib/actions/users.ts#L164)

### 2. Security Headers

Aplicados automaticamente em todas as respostas:

```typescript
// middleware.ts
headers.set('X-Content-Type-Options', 'nosniff')           // Previne MIME sniffing
headers.set('X-Frame-Options', 'DENY')                     // Previne clickjacking
headers.set('X-XSS-Protection', '1; mode=block')           // XSS protection
headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
```

### 3. Validação de Dados

#### Server-side com Zod

```typescript
const userSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos')
})

// Em Server Actions
const validated = userSchema.parse(data)
```

#### Client-side com React Hook Form

```typescript
<input
  {...register('email', {
    required: 'Email é obrigatório',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Email inválido'
    }
  })}
/>
```

### 4. SQL Injection Protection

✅ **Prisma usa prepared statements automaticamente**

```typescript
// ✅ Seguro - Prisma parametriza automaticamente
await prisma.user.findMany({
  where: { email: userInput }
})

// ❌ NUNCA faça isso (raw SQL)
await prisma.$executeRaw`SELECT * FROM users WHERE email = ${userInput}`
```

### 5. Environment Variables

```bash
# .gitignore (já configurado)
.env
.env.local
.env.production

# Sempre use .env.example para documentar
cp .env.example .env
```

**⚠️ Nunca commite:**
- `.env`
- Senhas
- API keys
- DATABASE_URL

---

## 🚨 Tratamento de Erros

### 1. Classes de Erro Customizadas

**Arquivo:** [lib/errors.ts](lib/errors.ts)

```typescript
export class DatabaseError extends AppError {
  constructor(message = 'Erro ao acessar banco de dados') {
    super(message, 'DATABASE_ERROR', 500)
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Dados inválidos') {
    super(message, 'VALIDATION_ERROR', 400)
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso não encontrado') {
    super(message, 'NOT_FOUND', 404)
  }
}
```

### 2. Try-Catch em Todas as Camadas

#### Server Actions

```typescript
export async function createUser(data: UserFormData) {
  try {
    await validateCSRF()
    const validated = userSchema.parse(data)
    await prisma.user.create({ data: validated })
    revalidateTag('users')
    return { success: true }
  } catch (error) {
    if (error.code === 'P2002') {
      return { success: false, error: 'Email já cadastrado', field: 'email' }
    }
    logError(error, 'createUser')
    return { success: false, error: 'Erro ao criar usuário' }
  }
}
```

#### Prisma Error Codes Tratados

| Código | Significado | Tratamento |
|--------|-------------|-----------|
| P2002 | Unique constraint violation | "Email/CPF já cadastrado" |
| P2003 | Foreign key constraint | "Não é possível deletar" |
| P2025 | Record not found | "Registro não encontrado" |

### 3. Error Boundaries

#### Global Error Page

**Arquivo:** [app/error.tsx](app/error.tsx)

Captura erros não tratados em toda a aplicação.

#### 404 Customizado

**Arquivo:** [app/not-found.tsx](app/not-found.tsx)

Página amigável para recursos não encontrados.

### 4. Toast Notifications

**Biblioteca:** [Sonner](https://sonner.emilkowal.ski/)

```typescript
import { toast } from 'sonner'

// Sucesso
toast.success('Usuário criado com sucesso!')

// Erro
toast.error('Erro ao salvar', {
  description: 'Email já cadastrado'
})

// Info
toast.info('Endereço preenchido automaticamente')
```

### 5. Logging Contextualizado

```typescript
logError(error, 'functionName')
// Output: [functionName] 2025-11-06T12:00:00.000Z: Error message
```

---

## 🚀 Deploy

### Vercel (Recomendado)

#### 1. Prepare o código

```bash
git add .
git commit -m "Ready for deploy"
git push origin main
```

#### 2. Configure na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Importe seu repositório do GitHub
4. Configure environment variables:
   - `DATABASE_URL` - Connection pooling URL
   - `DIRECT_URL` - Direct connection URL
5. Click **"Deploy"**

#### 3. Execute migrations em produção

```bash
# Configure .env com URLs de produção
npx prisma migrate deploy
```

#### 4. (Opcional) Seed em produção

```bash
npx prisma db seed
```

### Outras Plataformas

O projeto é compatível com:
- ✅ **Vercel** - Recomendado (otimizado para Next.js)
- ✅ **Railway** - Database PostgreSQL incluído
- ✅ **Render** - Free tier disponível
- ✅ **AWS Amplify** - Integração com AWS
- ✅ **DigitalOcean App Platform** - Simples e confiável

### Variáveis de Ambiente (Produção)

```env
DATABASE_URL="postgresql://postgres:senha@db.xxx.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=10"
DIRECT_URL="postgresql://postgres:senha@db.xxx.pooler.supabase.com:6543/postgres"
```

**⚠️ Importante:**
- Use connection pooling para `DATABASE_URL`
- Use direct connection para `DIRECT_URL`
- Configure whitelist de IPs no Supabase (use `0.0.0.0/0` para serverless)

### Checklist de Deploy

- [ ] Build local funciona (`npm run build`)
- [ ] Environment variables configuradas
- [ ] Migrations aplicadas em produção
- [ ] Seed executado (se necessário)
- [ ] Site acessível e funcional
- [ ] Testar criar/editar/deletar usuário
- [ ] Verificar filtros e paginação

---

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento (localhost:3000)

# Build
npm run build            # Cria build de produção otimizado

# Produção
npm start                # Inicia servidor de produção

# Linting
npm run lint             # Executa ESLint

# Prisma
npx prisma studio        # GUI do banco de dados (localhost:5555)
npx prisma generate      # Gera Prisma Client
npx prisma migrate dev   # Cria e aplica migration (desenvolvimento)
npx prisma migrate deploy # Aplica migrations (produção)
npx prisma db seed       # Popula banco com dados de exemplo
npx prisma db push       # Sincroniza schema sem criar migration
npx prisma db pull       # Puxa schema do banco para prisma/schema.prisma

# Limpeza
rm -rf .next             # Remove cache do Next.js (Windows: rmdir /s .next)
rm -rf node_modules      # Remove dependências (Windows: rmdir /s node_modules)
npm install              # Reinstala dependências limpas
```

---

## 📝 Comandos Úteis

### Resolver problemas de cache

```bash
# Limpar cache do Next.js
rm -rf .next

# Limpar cache do npm
npm cache clean --force

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### Debug do Prisma

```bash
# Ver queries SQL executadas
DEBUG="prisma:query" npm run dev

# Ver informações de engine
DEBUG="prisma:engine" npm run dev

# Ver todas as queries e info
DEBUG="prisma:*" npm run dev
```

### Migrations

```bash
# Criar migration
npx prisma migrate dev --name nome_da_migration

# Ver status das migrations
npx prisma migrate status

# Reset do banco (CUIDADO! Deleta tudo)
npx prisma migrate reset

# Aplicar migrations em produção
npx prisma migrate deploy
```


## 📄 Licença

Este projeto está sob a licença **ISC**.

---

## 🙋 Suporte e Ajuda

### Documentação Oficial

- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)
- **Prisma:** [prisma.io/docs](https://www.prisma.io/docs)
- **Supabase:** [supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS:** [tailwindcss.com/docs](https://tailwindcss.com/docs)
- **TypeScript:** [typescriptlang.org/docs](https://www.typescriptlang.org/docs)

### Problemas Comuns

#### Erro: "Missing required environment variable"
**Solução:** Verifique se o arquivo `.env` existe e contém `DATABASE_URL` e `DIRECT_URL`.

#### Erro: "Can't reach database server"
**Solução:**
1. Confirme que as URLs no `.env` estão corretas
2. Verifique se o projeto Supabase está ativo
3. Teste a conexão: `npx prisma studio`

#### Erro: "Table 'users' doesn't exist"
**Solução:** Execute as migrations: `npx prisma migrate dev`

#### Porta 3000 já em uso
**Solução:** Use outra porta: `npm run dev -- -p 3001`

#### Build falha com erro de TypeScript
**Solução:**
```bash
npx prisma generate  # Regenera types do Prisma
npm run build        # Tenta build novamente
```

## 👨‍💻 Desenvolvedor

**GitHub:** [gesser0102](https://github.com/gesser0102)


**Next.js:** 16.0.1 | **React:** 19.2.0 | **Prisma:** 6.18.0 | **TypeScript:** 5.9.3

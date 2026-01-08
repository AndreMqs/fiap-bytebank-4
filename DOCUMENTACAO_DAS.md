# 📐 Documentação de Arquitetura de Software (DAS) - ByteBank

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Arquitetura do Sistema](#arquitetura-do-sistema)
4. [Padrões Arquiteturais](#padrões-arquiteturais)
5. [Requisitos Implementados](#requisitos-implementados)
6. [Como Executar o Projeto](#como-executar-o-projeto)
7. [Estrutura de Diretórios](#estrutura-de-diretórios)

---

## 🎯 Visão Geral

O **ByteBank** é uma aplicação web bancária moderna desenvolvida seguindo os princípios de **Clean Architecture** e **MVVM (Model-View-ViewModel)**, com foco em performance, segurança e experiência do usuário.

### Características Principais

- ✅ Arquitetura modular e escalável
- ✅ State Management avançado com React Query, Zustand e RxJS
- ✅ Performance otimizada com lazy loading e code splitting
- ✅ Mobile First com responsividade completa
- ✅ Segurança com autenticação e criptografia
- ✅ Integração completa com Firebase

---

## 🛠️ Stack Tecnológica

### Core Framework
- **React 19.1.0** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.7.2** - Superset JavaScript com tipagem estática
- **Vite 6.3.1** - Build tool e dev server de alta performance

### State Management
- **@tanstack/react-query 4.30.0** - Gerenciamento de estado do servidor e cache
- **Zustand 5.0.6** - Gerenciamento de estado de UI (leve e performático)
- **RxJS 7.8.0** - Programação reativa para ViewModels (MVVM)

### UI & Styling
- **Material-UI (MUI) 7.0.2** - Componentes de UI
- **@emotion/react & @emotion/styled 11.14.0** - CSS-in-JS
- **SASS 1.87.0** - Pré-processador CSS
- **Recharts 3.1.0** - Biblioteca de gráficos

### Backend & Database
- **Firebase 10.14.1** - Backend as a Service
  - Firebase Auth - Autenticação
  - Firestore - Banco de dados NoSQL
  - Firebase Storage - Armazenamento de arquivos

### Routing
- **React Router DOM 6.14.0** - Roteamento client-side
- **Vike 0.4.236** - Framework meta para React

### Utilities
- **crypto-js 4.1.1** - Criptografia AES para dados sensíveis
- **lodash 4.17.21** - Utilitários JavaScript
- **classnames 2.5.1** - Manipulação de classes CSS

### Development Tools
- **ESLint 9.22.0** - Linter para qualidade de código
- **TypeScript ESLint 8.26.1** - Linter TypeScript

---

## 🏗️ Arquitetura do Sistema

### Visão Geral da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      CAMADA DE APRESENTAÇÃO                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Components  │  │    Views     │  │    Hooks     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE VIEWMODELS                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ AuthViewModel│  │DashboardVM   │  │  RxJS        │       │
│  │  (RxJS)      │  │  (RxJS)      │  │  Observables │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      CAMADA DE DOMÍNIO                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  Entities    │  │  Use Cases   │  │  Business    │       │
│  │              │  │              │  │  Rules        │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE INFRAESTRUTURA                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Repositories │  │  Firebase    │  │  React Query │       │
│  │              │  │  Client      │  │  Config      │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      FIREBASE SERVICES                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │   Auth       │  │  Firestore   │  │  Storage     │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Padrão MVVM (Model-View-ViewModel)

O projeto segue o padrão **MVVM** para separação de responsabilidades:

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│    VIEW     │ ◄─────► │  VIEWMODEL   │ ◄─────► │    MODEL    │
│ (Component) │         │   (RxJS)     │         │  (Domain)   │
└─────────────┘         └──────────────┘         └─────────────┘
     │                        │                        │
     │                        │                        │
     └────────────────────────┴────────────────────────┘
                    useReactive Hook
```

**Fluxo de Dados MVVM:**
1. **View (Component)** - Renderiza a UI e captura interações do usuário
2. **ViewModel (RxJS)** - Gerencia estado reativo e lógica de apresentação
3. **Model (Domain)** - Contém entidades e regras de negócio
4. **useReactive Hook** - Conecta ViewModels (Observables) com componentes React

---

## 📐 Padrões Arquiteturais

### 1. Clean Architecture

A aplicação segue os princípios da **Clean Architecture**, separando o código em camadas independentes:

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION                          │
│  • Componentes React                                     │
│  • Hooks customizados                                    │
│  • Views                                                 │
│  Depende de: Domain                                      │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                      DOMAIN                              │
│  • Entities (BankTransaction, BankUser, Investment)     │
│  • Use Cases (GetUserTransactions, AddBankTransaction) │
│  • Regras de Negócio                                    │
│  NÃO depende de: Infrastructure ou Presentation         │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE                          │
│  • Repositories (TransactionRepository, UserRepository) │
│  • Firebase Client                                      │
│  • React Query Config                                   │
│  • Secure Storage (Crypto)                              │
│  Depende de: Domain                                     │
└─────────────────────────────────────────────────────────┘
```

**Princípios Aplicados:**
- ✅ **Dependency Rule** - Dependências apontam para dentro
- ✅ **Independence** - Domain é independente de frameworks
- ✅ **Testability** - Fácil mockar repositórios
- ✅ **Use Cases** - Lógica de negócio isolada

### 2. Arquitetura Modular

A aplicação é organizada em módulos independentes:

```
src/
├── app/              # Módulo de configuração
│   ├── App.tsx       # Providers globais
│   └── router.tsx    # Rotas da aplicação
│
├── home/             # Módulo Landing Page
│   ├── components/  # Componentes específicos
│   ├── pages/       # Páginas do módulo
│   └── App.tsx       # Entry point do módulo
│
├── main/             # Módulo Aplicação Principal
│   ├── components/  # Componentes da aplicação
│   ├── hooks/       # Hooks customizados
│   ├── store/       # Estado de UI (Zustand)
│   └── App.tsx       # Entry point do módulo
│
├── domain/           # Camada de Domínio
│   ├── entities/    # Entidades de negócio
│   └── usecases/    # Casos de uso
│
├── infra/            # Camada de Infraestrutura
│   ├── firebase/     # Configuração Firebase
│   ├── react-query/  # Configuração React Query
│   ├── repositories/ # Implementação de repositórios
│   └── crypto/       # Criptografia
│
├── presentation/      # Camada de Apresentação
│   └── components/   # Componentes compartilhados
│
└── viewmodels/       # ViewModels (MVVM)
    ├── auth/         # AuthViewModel
    └── dashboard/    # DashboardViewModel
```

**Características:**
- ✅ Cada módulo é autocontido
- ✅ Separação por features (home, main)
- ✅ Separação por responsabilidade (domain, infra, presentation)
- ✅ Fácil manutenção e escalabilidade

---

## ✅ Requisitos Implementados

### 1. Arquitetura Modular ⭐⭐⭐⭐⭐

**Implementação:**
- Estrutura modular bem definida
- Módulos independentes (home, main)
- Separação por features e responsabilidades
- Barrel exports para organização

**Estrutura:**
```
Módulos Principais:
├── home/     → Landing page (autocontido)
├── main/     → Aplicação principal (autocontido)
├── domain/   → Regras de negócio (independente)
├── infra/    → Implementações técnicas
└── presentation/ → Componentes de UI
```

### 2. State Management Avançado ⭐⭐⭐⭐⭐

**Arquitetura de State Management:**

```
┌─────────────────────────────────────────┐
│  React Query (Server State)             │
│  • Fonte única de verdade               │
│  • Cache automático                     │
│  • Invalidação inteligente              │
│  • Infinite queries                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Zustand (UI State)                     │
│  • Modais                               │
│  • Filtros                              │
│  • Estado de edição                     │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  RxJS (Reactive Programming)            │
│  • ViewModels com BehaviorSubject       │
│  • Programação reativa                  │
│  • Padrão MVVM                          │
└─────────────────────────────────────────┘
```

**Hooks Customizados:**
- `useUserData()` - Dados do usuário
- `useTransactionsData()` - Transações (infinite query)
- `useInvestmentsData()` - Investimentos
- `useTransactionCalculations()` - Cálculos derivados
- `useAddTransaction()` - Mutations
- `useUpdateTransaction()` - Mutations
- `useDeleteTransaction()` - Mutations

### 3. Clean Architecture ⭐⭐⭐⭐⭐

**Separação de Camadas:**

```
Fluxo de Dependências:
Component → Hook → Use Case → Repository → Firebase
   ↓         ↓        ↓          ↓           ↓
Presentation → Domain ← Infrastructure
```

**Exemplo Prático:**
```typescript
// Presentation Layer
<Statement transactions={transactions} />

// Domain Layer
export class GetUserTransactions {
  async execute(userId: string): Promise<Transaction[]>
}

// Infrastructure Layer
export class TransactionRepository {
  async getTransactions(userId: string): Promise<BankTransaction[]>
}
```

### 4. Lazy Loading e Pré-carregamento ⭐⭐⭐⭐⭐

**Implementações:**

**Lazy Loading de Rotas:**
```typescript
const HomeModule = React.lazy(() => import('../home/App'))
const MainModule = React.lazy(() => import('../main/App'))
```

**Lazy Loading de Componentes:**
```typescript
const CategoryChart = lazy(() => import("../CategoryChart/CategoryChart"))
const Investments = lazy(() => import("../Investments/Investments"))
```

**Lazy Loading de Modais:**
```typescript
const LoginModal = lazy(() => import("./LoginModal/LoginModal"))
const FilterModal = lazy(() => import('./FilterModal/FilterModal'))
```

**Pré-carregamento (Prefetch):**
```typescript
// Prefetch ao hover
<button onMouseEnter={() => prefetchRoute('main')}>
  Já tenho conta
</button>
```

**Code Splitting:**
```typescript
// vite.config.ts
manualChunks: {
  'vendor-react': ['react', 'react-dom'],
  'vendor-mui': ['@mui/material'],
  'vendor-charts': ['recharts'],
  'vendor-firebase': ['firebase/app', 'firebase/firestore'],
  'vendor-query': ['@tanstack/react-query'],
  'vendor-rxjs': ['rxjs'],
}
```

### 5. Cache ⭐⭐⭐⭐⭐

**Estratégia de Cache:**

```
┌─────────────────────────────────────────┐
│  React Query Cache                      │
│  • staleTime: 5 minutos                │
│  • gcTime: 10 minutos                  │
│  • Query keys estruturadas             │
│  • Invalidação automática              │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Secure Storage (Criptografado)         │
│  • Dados do usuário                     │
│  • Criptografia AES                     │
│  • Persistência local                   │
└─────────────────────────────────────────┘
```

**Configuração:**
```typescript
queryClient: {
  staleTime: 5 * 60 * 1000,  // 5 minutos
  gcTime: 10 * 60 * 1000,     // 10 minutos
  refetchOnWindowFocus: false,
}
```

### 6. Programação Reativa ⭐⭐⭐⭐⭐

**Implementação com RxJS:**

```
┌─────────────┐         ┌──────────────┐
│  Component  │ ◄─────► │  ViewModel   │
│             │         │  (RxJS)      │
└─────────────┘         └──────────────┘
     │                        │
     │    useReactive Hook    │
     └────────────────────────┘
```

**Exemplo:**
```typescript
// ViewModel
export class DashboardViewModel {
  private state$ = new BehaviorSubject<DashboardState>(initialState)
  
  get state() {
    return this.state$.asObservable()
  }
}

// Hook Reativo
export function useReactive(obs: any) {
  const [state, setState] = useState()
  useEffect(() => {
    const s = obs.subscribe(setState)
    return () => s.unsubscribe()
  }, [obs])
  return state
}

// Uso
const state = useReactive(authViewModel.state)
```

### 7. Mobile First ⭐⭐⭐⭐⭐

**Breakpoints Padronizados:**

```
Mobile:      até 425px   (estilos base)
Tablet:      426px-768px
Desktop:     769px-1024px
Large:       1920px+
```

**Implementação:**
```scss
// Mobile First
.statementContainer {
  width: 100%;           // Mobile primeiro
  padding: 24px 8px;
  
  @include tablet-and-up {
    padding: 32px 24px;
  }
  
  @include desktop-and-up {
    width: 282px;
  }
  
  @include large-desktop {
    width: 320px;
  }
}
```

**Componentes Responsivos:**
- ✅ Statement
- ✅ MainPage
- ✅ CategoryChart
- ✅ Header
- ✅ Summary
- ✅ NewTransaction
- ✅ Menu

### 8. Segurança ⭐⭐⭐⭐⭐

**Implementações de Segurança:**

```
┌─────────────────────────────────────────┐
│  Firebase Authentication                 │
│  • Autenticação segura                  │
│  • Gerenciamento de sessão              │
│  • Proteção de rotas                    │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Criptografia AES                       │
│  • Dados sensíveis criptografados       │
│  • Secure Storage                       │
│  • Variáveis de ambiente                │
└─────────────────────────────────────────┘
```

**Autenticação:**
```typescript
// Firebase Auth
- Login/Register
- Gerenciamento de sessão
- RequireAuth component
```

**Criptografia:**
```typescript
// secureStorage.ts
export const secureStorage = {
  set<T>(key: string, value: T) {
    const cipher = CryptoJS.AES.encrypt(JSON.stringify(value), KEY)
    localStorage.setItem(key, cipher.toString())
  },
  get<T>(key: string): T | null {
    const cipher = localStorage.getItem(key)
    const decrypted = CryptoJS.AES.decrypt(cipher, KEY)
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
  }
}
```

### 9. Firebase ⭐⭐⭐⭐⭐

**Integração Completa:**

```
┌─────────────────────────────────────────┐
│  Firebase Services                      │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │   Auth   │  │ Firestore│  │Storage ││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Repositories (Abstração)                │
│  • TransactionRepository                │
│  • UserRepository                       │
│  • InvestmentRepository                 │
└─────────────────────────────────────────┘
```

**Collections no Firestore:**
- `users` - Dados dos usuários
- `transactions` - Transações bancárias
- `investments` - Investimentos

**Recursos Implementados:**
- ✅ CRUD completo
- ✅ Paginação com `startAfter` e `limit`
- ✅ Queries com filtros (`where`, `orderBy`)
- ✅ Timestamps automáticos
- ✅ Tratamento de erros

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** 18+ e npm
- **Firebase Project** configurado
- **Variáveis de ambiente** configuradas

### Instalação

1. **Clone o repositório:**
```bash
git clone <repository-url>
cd fiap-bytebank-4
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=sua-api-key
VITE_FIREBASE_AUTH_DOMAIN=seu-auth-domain
VITE_FIREBASE_PROJECT_ID=seu-project-id
VITE_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
VITE_FIREBASE_APP_ID=seu-app-id

# Encryption Key (obrigatória em produção)
VITE_ENCRYPTION_KEY=sua-chave-de-criptografia-secreta

# Opcional: Desabilitar Firebase (desenvolvimento)
# VITE_FIREBASE_DISABLED=false
```

4. **Execute o projeto em desenvolvimento:**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

5. **Build para produção:**
```bash
npm run build
```

6. **Preview da build:**
```bash
npm run preview
```

### Scripts Disponíveis

```json
{
  "dev": "vite --host",           // Desenvolvimento
  "build": "vite build",           // Build de produção
  "preview": "vite preview",       // Preview da build
  "lint": "eslint ."               // Linter
}
```

### Estrutura do Firebase

**Collections necessárias:**

1. **users**
   - `id` (string)
   - `name` (string)
   - `email` (string)
   - `balance` (number)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

2. **transactions**
   - `userId` (string)
   - `type` (string: "income" | "expense")
   - `category` (string)
   - `value` (number)
   - `date` (string)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

3. **investments**
   - `userId` (string)
   - `type` (string: "renda_fixa" | "renda_variavel")
   - `value` (number)
   - `createdAt` (timestamp)
   - `updatedAt` (timestamp)

---

## 📁 Estrutura de Diretórios

```
fiap-bytebank-4/
├── public/                    # Arquivos estáticos
├── src/
│   ├── app/                   # Configuração da aplicação
│   │   ├── App.tsx           # Providers globais
│   │   └── router.tsx        # Rotas
│   │
│   ├── domain/                # Camada de Domínio
│   │   ├── entities/         # Entidades de negócio
│   │   │   ├── BankTransaction.ts
│   │   │   ├── BankUser.ts
│   │   │   └── Investment.ts
│   │   └── usecases/         # Casos de uso
│   │       ├── GetUserTransactions.ts
│   │       ├── AddBankTransaction.ts
│   │       └── ...
│   │
│   ├── infra/                 # Camada de Infraestrutura
│   │   ├── firebase/         # Configuração Firebase
│   │   │   └── firebaseClient.ts
│   │   ├── react-query/      # Configuração React Query
│   │   │   ├── queryClient.ts
│   │   │   └── queryKeys.ts
│   │   ├── repositories/     # Repositórios
│   │   │   ├── TransactionRepository.ts
│   │   │   ├── UserRepository.ts
│   │   │   └── InvestmentRepository.ts
│   │   └── crypto/           # Criptografia
│   │       └── secureStorage.ts
│   │
│   ├── presentation/          # Camada de Apresentação
│   │   └── components/
│   │       └── layout/
│   │           ├── LoadingFallback.tsx
│   │           └── RequireAuth.tsx
│   │
│   ├── viewmodels/            # ViewModels (MVVM)
│   │   ├── auth/
│   │   │   └── AuthViewModel.ts
│   │   └── dashboard/
│   │       └── DashboardViewModel.ts
│   │
│   ├── home/                  # Módulo Landing Page
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   │
│   ├── main/                  # Módulo Aplicação Principal
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── store/
│   │   ├── types/
│   │   └── App.tsx
│   │
│   └── hooks/                 # Hooks compartilhados
│       ├── useAuth.ts
│       └── useReactive.ts
│
├── .env                       # Variáveis de ambiente
├── vite.config.ts            # Configuração Vite
├── package.json              # Dependências
└── README.md                 # Documentação principal
```

---

## 📊 Diagramas de Arquitetura

### Fluxo de Dados Completo

```
┌──────────────┐
│   Usuário    │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────┐
│      COMPONENTE REACT               │
│  (Presentation Layer)                │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      HOOK CUSTOMIZADO                │
│  (useUserData, useTransactionsData)  │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      VIEWMODEL (RxJS)                │
│  (MVVM Pattern)                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      USE CASE                        │
│  (Domain Layer)                      │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      REPOSITORY                      │
│  (Infrastructure Layer)              │
└──────┬──────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│      FIREBASE FIRESTORE              │
│  (Backend)                           │
└─────────────────────────────────────┘
```

### State Management Flow

```
┌─────────────────────────────────────────────┐
│           REACT QUERY                        │
│  ┌──────────────────────────────────────┐   │
│  │  Server State                        │   │
│  │  • useUserData()                     │   │
│  │  • useTransactionsData()             │   │
│  │  • useInvestmentsData()              │   │
│  │  • Cache automático                  │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           ZUSTAND                            │
│  ┌──────────────────────────────────────┐   │
│  │  UI State                            │   │
│  │  • Modais                            │   │
│  │  • Filtros                           │   │
│  │  • Estado de edição                  │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           RXJS                               │
│  ┌──────────────────────────────────────┐   │
│  │  Reactive State                      │   │
│  │  • ViewModels                        │   │
│  │  • BehaviorSubject                   │   │
│  │  • Observables                       │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Clean Architecture Layers

```
┌─────────────────────────────────────────────┐
│         PRESENTATION LAYER                    │
│  • Componentes React                          │
│  • Hooks customizados                         │
│  • Views                                      │
│  Depende de: Domain                           │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│           DOMAIN LAYER                       │
│  • Entities                                   │
│  • Use Cases                                  │
│  • Business Rules                             │
│  NÃO depende de: Infrastructure/Presentation │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│       INFRASTRUCTURE LAYER                   │
│  • Repositories                               │
│  • Firebase Client                            │
│  • React Query Config                         │
│  • Secure Storage                             │
│  Depende de: Domain                           │
└─────────────────────────────────────────────┘
```

---

## 🎯 Conclusão

O projeto **ByteBank** implementa uma arquitetura moderna e robusta, seguindo os princípios de **Clean Architecture** e **MVVM**, com foco em:

- ✅ **Modularidade** - Código organizado e escalável
- ✅ **Performance** - Lazy loading, code splitting, cache
- ✅ **Segurança** - Autenticação e criptografia
- ✅ **Responsividade** - Mobile First
- ✅ **Manutenibilidade** - Separação de responsabilidades
- ✅ **Testabilidade** - Arquitetura preparada para testes

**Tecnologias Modernas:**
- React 19 + TypeScript
- React Query + Zustand + RxJS
- Firebase (Auth + Firestore)
- Vite (Build tool)
- Material-UI

**Padrões Aplicados:**
- MVVM (Model-View-ViewModel)
- Clean Architecture
- Repository Pattern
- Observer Pattern (RxJS)

---

*Documentação atualizada em: Dezembro 2024*  
*Versão: 1.0.0*


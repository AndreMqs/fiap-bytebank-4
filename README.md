# 🏦 ByteBank - Sistema Bancário Moderno

> Aplicação web bancária desenvolvida com **React**, **TypeScript**, **Firebase** e arquitetura **MVVM** seguindo os princípios de **Clean Architecture**.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14.1-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF?logo=vite)](https://vitejs.dev/)

## 📋 Índice

- [Sobre o Projeto](#-sobre-o-projeto)
- [Arquitetura](#-arquitetura)
- [Stack Tecnológica](#-stack-tecnológica)
- [Requisitos Implementados](#-requisitos-implementados)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Documentação](#-documentação)

---

## 🎯 Sobre o Projeto

O **ByteBank** é uma aplicação web bancária moderna que implementa uma arquitetura robusta seguindo os princípios de **Clean Architecture** e o padrão **MVVM (Model-View-ViewModel)**.

### Características Principais

- ✅ **Arquitetura Modular** - Código organizado e escalável
- ✅ **State Management Avançado** - React Query + Zustand + RxJS
- ✅ **Clean Architecture** - Separação de camadas (Presentation, Domain, Infrastructure)
- ✅ **Performance Otimizada** - Lazy loading, code splitting, cache inteligente
- ✅ **Programação Reativa** - RxJS em ViewModels (MVVM)
- ✅ **Mobile First** - Design responsivo para todos os dispositivos
- ✅ **Segurança** - Autenticação Firebase + Criptografia AES
- ✅ **Integração Firebase** - Firestore, Auth e Storage

---

## 🏗️ Arquitetura

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

### Clean Architecture

```
┌─────────────────────────────────────────┐
│         PRESENTATION LAYER                │
│  • Componentes React                     │
│  • Hooks customizados                    │
│  Depende de: Domain                       │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│           DOMAIN LAYER                   │
│  • Entities                              │
│  • Use Cases                             │
│  • Business Rules                        │
│  NÃO depende de: Infrastructure          │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       INFRASTRUCTURE LAYER               │
│  • Repositories                          │
│  • Firebase Client                        │
│  • React Query Config                    │
│  Depende de: Domain                      │
└─────────────────────────────────────────┘
```

### State Management

```
React Query (Server State) → Zustand (UI State) → RxJS (Reactive)
     ↓                           ↓                      ↓
  Dados do servidor          Modais/Filtros        ViewModels
```

---

## 🛠️ Stack Tecnológica

### Core
- **React 19.1.0** - Biblioteca JavaScript para interfaces
- **TypeScript 5.7.2** - Tipagem estática
- **Vite 6.3.1** - Build tool de alta performance

### State Management
- **@tanstack/react-query 4.30.0** - Server state e cache
- **Zustand 5.0.6** - UI state (leve e performático)
- **RxJS 7.8.0** - Programação reativa (ViewModels)

### UI & Styling
- **Material-UI 7.0.2** - Componentes de UI
- **Emotion 11.14.0** - CSS-in-JS
- **SASS 1.87.0** - Pré-processador CSS
- **Recharts 3.1.0** - Gráficos

### Backend
- **Firebase 10.14.1**
  - Firebase Auth - Autenticação
  - Firestore - Banco de dados NoSQL
  - Firebase Storage - Armazenamento

### Utilities
- **crypto-js 4.1.1** - Criptografia AES
- **lodash 4.17.21** - Utilitários JavaScript
- **react-router-dom 6.14.0** - Roteamento

---

## ✅ Requisitos Implementados

| Requisito | Status | Implementação |
|-----------|--------|---------------|
| **Arquitetura Modular** | ✅ | Estrutura modular bem definida |
| **State Management Avançado** | ✅ | React Query + Zustand + RxJS |
| **Clean Architecture** | ✅ | Camadas separadas corretamente |
| **Lazy Loading** | ✅ | Rotas, componentes e modais |
| **Cache** | ✅ | React Query + Secure Storage |
| **Programação Reativa** | ✅ | RxJS em ViewModels (MVVM) |
| **Mobile First** | ✅ | Breakpoints padronizados |
| **Segurança** | ✅ | Firebase Auth + Criptografia AES |

---

## 🚀 Como Executar

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

# Encryption Key (OBRIGATÓRIA em produção)
# Use uma chave forte e única (mínimo 32 caracteres)
VITE_ENCRYPTION_KEY=sua-chave-de-criptografia-secreta

# Opcional: Desabilitar Firebase (desenvolvimento)
# VITE_FIREBASE_DISABLED=false
```

**⚠️ IMPORTANTE:** A variável `VITE_ENCRYPTION_KEY` é **obrigatória** em produção. Use uma chave forte e única.

4. **Execute o projeto:**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

### Scripts Disponíveis

```bash
npm run dev        # Desenvolvimento
npm run build      # Build de produção
npm run preview    # Preview da build
npm run lint       # Executar ESLint
npm run lint:fix   # Executar ESLint e corrigir automaticamente
```

### ESLint

O projeto utiliza **ESLint 9** com configuração moderna (flat config) para garantir qualidade de código:

- ✅ Verificação de erros TypeScript
- ✅ Regras do React Hooks
- ✅ Regras de React Refresh
- ✅ Detecção de variáveis não utilizadas
- ✅ Avisos sobre uso de `any`

**Configuração:** `eslint.config.js`

**Comandos:**
- `npm run lint` - Verificar erros e warnings
- `npm run lint:fix` - Corrigir automaticamente problemas corrigíveis

---

## 📁 Estrutura do Projeto

```
src/
├── app/              # Configuração da aplicação
│   ├── App.tsx       # Providers globais
│   └── router.tsx    # Rotas
│
├── domain/           # Camada de Domínio
│   ├── entities/     # Entidades de negócio
│   └── usecases/     # Casos de uso
│
├── infra/            # Camada de Infraestrutura
│   ├── firebase/     # Configuração Firebase
│   ├── react-query/  # Configuração React Query
│   ├── repositories/ # Repositórios
│   └── crypto/       # Criptografia
│
├── presentation/      # Camada de Apresentação
│   └── components/   # Componentes compartilhados
│
├── viewmodels/       # ViewModels (MVVM)
│   ├── auth/         # AuthViewModel
│   └── dashboard/    # DashboardViewModel
│
├── home/             # Módulo Landing Page
│   ├── components/
│   └── App.tsx
│
└── main/             # Módulo Aplicação Principal
    ├── components/
    ├── hooks/
    ├── store/
    └── App.tsx
```

---

## 📚 Documentação

### Documentação Completa

- **[DOCUMENTACAO_DAS.md](./DOCUMENTACAO_DAS.md)** - Documentação de Arquitetura de Software completa

### Estrutura do Firebase

**Collections necessárias:**

1. **users**
   - `id`, `name`, `email`, `balance`, `createdAt`, `updatedAt`

2. **transactions**
   - `userId`, `type`, `category`, `value`, `date`, `createdAt`, `updatedAt`

3. **investments**
   - `userId`, `type`, `value`, `createdAt`, `updatedAt`

### Índices do Firestore

O projeto requer um índice composto para consultar transações por `userId` e ordenar por `date`.

**Opção 1: Criar via Console (Recomendado)**
1. Execute a aplicação e tente visualizar transações
2. O Firebase mostrará um erro com link direto
3. Clique no link e crie o índice no Firebase Console

**Opção 2: Deploy via Firebase CLI**
```bash
firebase deploy --only firestore:indexes
```

O arquivo `firestore.indexes.json` já está configurado na raiz.

---

## 🎯 Rotas da Aplicação

- `/` - Landing page (Home)
- `/main` - Área logada (protegida por `RequireAuth`)

---

## 🔐 Segurança

- ✅ Autenticação via Firebase Auth
- ✅ Criptografia AES para dados sensíveis
- ✅ Proteção de rotas com `RequireAuth`
- ✅ Variáveis de ambiente para chaves secretas

---

## 📊 Performance

- ✅ Lazy loading de rotas e componentes
- ✅ Code splitting otimizado
- ✅ Cache inteligente com React Query
- ✅ Pré-carregamento de rotas críticas
- ✅ Mobile First com breakpoints padronizados

---

## 🤝 Contribuindo

Este é um projeto acadêmico desenvolvido para demonstrar arquitetura frontend moderna.

---

## 📄 Licença

Este projeto é de uso acadêmico.

---

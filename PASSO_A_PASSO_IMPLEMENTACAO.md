# 📋 Passo a Passo Completo - Implementação do Projeto ByteBank

## 🎯 Visão Geral

Este documento detalha todos os passos necessários para implementar as features e arquitetura requeridas do projeto.

---

## 📦 FASE 1: Configuração Base e Arquitetura (Prioridade CRÍTICA)

### ✅ PASSO 1.1: Configurar Firestore no Firebase Client

**Arquivo:** `src/infra/firebase/firebaseClient.ts`

**O que fazer:**
1. Importar `getFirestore` do Firebase
2. Inicializar e exportar `db`
3. Garantir que funcione mesmo com Firebase desabilitado

**Código a adicionar:**
```typescript
import { getFirestore, type Firestore } from 'firebase/firestore'

let db: Firestore | null = null

if (firebaseEnabled && app) {
  db = getFirestore(app)
}

export { app, auth, db }
```

**Tempo estimado:** 15 minutos

---

### ✅ PASSO 1.2: Implementar React Query (Cache e State Management)

**Arquivos a criar/modificar:**
- `src/infra/react-query/queryClient.ts` (novo)
- `src/app/App.tsx` (modificar)

**O que fazer:**
1. Criar `QueryClient` com configurações de cache
2. Criar provider `QueryClientProvider`
3. Envolver a aplicação com o provider
4. Configurar cache persistido (opcional)

**Estrutura:**
```
src/infra/react-query/
  ├── queryClient.ts
  └── queryKeys.ts (para chaves de cache padronizadas)
```

**Tempo estimado:** 30 minutos

---

### ✅ PASSO 1.3: Refatorar Store Zustand para Integrar com Firebase

**Arquivo:** `src/main/store/useStore.ts`

**O que fazer:**
1. Remover dependência de `api.ts` mockado
2. Criar repositórios que usam Firestore
3. Integrar com React Query para cache
4. Manter Zustand apenas para estado local/UI

**Estrutura de dados no Firestore:**
- Collection `users/{userId}` - dados do usuário
- Collection `transactions/{transactionId}` - transações
- Collection `investments/{investmentId}` - investimentos

**Tempo estimado:** 1-2 horas

---

### ✅ PASSO 1.4: Criar Estrutura de Repositórios para Firestore

**Arquivos a criar:**
- `src/infra/repositories/UserRepository.ts` (novo)
- `src/infra/repositories/TransactionRepository.ts` (modificar)
- `src/infra/repositories/InvestmentRepository.ts` (novo)

**O que fazer:**
1. Implementar CRUD completo para cada entidade
2. Usar Firestore com queries otimizadas
3. Implementar paginação para listas grandes
4. Tratamento de erros

**Tempo estimado:** 2-3 horas

---

### ✅ PASSO 1.5: Criar Use Cases Completos (Clean Architecture)

**Arquivos a criar/modificar:**
- `src/domain/usecases/GetUser.ts` (novo)
- `src/domain/usecases/UpdateUser.ts` (novo)
- `src/domain/usecases/GetTransactions.ts` (modificar)
- `src/domain/usecases/AddTransaction.ts` (modificar)
- `src/domain/usecases/UpdateTransaction.ts` (novo)
- `src/domain/usecases/DeleteTransaction.ts` (modificar)
- `src/domain/usecases/GetInvestments.ts` (novo)
- `src/domain/usecases/AddInvestment.ts` (novo)

**O que fazer:**
1. Cada use case deve receber repositório via DI
2. Implementar validações de negócio
3. Tratamento de erros padronizado

**Tempo estimado:** 2-3 horas

---

## 🔐 FASE 2: Autenticação e Segurança

### ✅ PASSO 2.1: Implementar Cadastro (Register) com Firebase

**Arquivo:** `src/home/components/HomePage/RegisterModal/RegisterModal.tsx`

**O que fazer:**
1. Integrar com `AuthViewModel` (adicionar método `register`)
2. Criar usuário no Firebase Auth
3. Após sucesso, criar documento do usuário no Firestore
4. Redirecionar para `/main` após cadastro
5. Validações:
   - Email válido
   - Senha com mínimo de 6 caracteres
   - Nome obrigatório

**Adicionar em `AuthViewModel.ts`:**
```typescript
async register(email: string, password: string, name: string) {
  // Implementar createUserWithEmailAndPassword
  // Criar documento no Firestore users/{uid}
}
```

**Tempo estimado:** 1 hora

---

### ✅ PASSO 2.2: Melhorar Login e Integração

**Arquivo:** `src/home/components/HomePage/LoginModal/LoginModal.tsx`

**O que fazer:**
1. Remover lógica de bypass (ou manter apenas para dev)
2. Após login bem-sucedido, buscar dados do usuário no Firestore
3. Atualizar store do Zustand com dados do usuário
4. Redirecionar para `/main`

**Tempo estimado:** 30 minutos

---

### ✅ PASSO 2.3: Adicionar Logout no Menu

**Arquivo:** `src/main/components/Menu/Menu.tsx`

**O que fazer:**
1. Adicionar botão "Sair" no final do menu
2. Chamar `authViewModel.logout()`
3. Limpar store do Zustand
4. Redirecionar para `/` ou `/login`

**Tempo estimado:** 20 minutos

---

### ✅ PASSO 2.4: Corrigir Segurança da Chave de Criptografia

**Arquivo:** `src/infra/crypto/secureStorage.ts`

**O que fazer:**
1. Remover fallback hardcoded
2. Tornar `VITE_ENCRYPTION_KEY` obrigatório
3. Adicionar validação no início da aplicação
4. Documentar no README

**Tempo estimado:** 15 minutos

---

## 🏠 FASE 3: Tela Principal (Início)

### ✅ PASSO 3.1: Implementar GET de Dados do Usuário

**Arquivo:** `src/main/components/MainPage/MainPage.tsx`

**O que fazer:**
1. Ao carregar a tela, fazer GET do usuário do Firestore
2. Usar React Query para cache
3. Atualizar store do Zustand
4. Mostrar loading enquanto busca

**Estrutura do documento no Firestore:**
```typescript
{
  id: string (userId),
  name: string,
  email: string,
  balance: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Tempo estimado:** 1 hora

---

### ✅ PASSO 3.2: Atualizar Card "Olá Cliente" com Nome do Usuário

**Arquivo:** `src/main/components/Summary/Summary.tsx`

**O que fazer:**
1. Buscar nome do usuário da store do Zustand
2. Mostrar "Olá, {nome}!" 
3. Se não tiver nome, mostrar "Olá, Cliente!"

**Tempo estimado:** 15 minutos

---

### ✅ PASSO 3.3: Atualizar Saldo do Firebase

**Arquivo:** `src/main/components/Summary/Summary.tsx`

**O que fazer:**
1. Buscar `balance` do usuário da store
2. Calcular saldo baseado em transações (ou manter no documento do usuário)
3. Atualizar saldo sempre que houver nova transação

**Estratégia:**
- Opção 1: Calcular saldo dinamicamente somando transações
- Opção 2: Manter saldo no documento do usuário e atualizar a cada transação (recomendado para performance)

**Tempo estimado:** 1 hora

---

### ✅ PASSO 3.4: Atualizar Gráfico de Gastos por Categoria

**Arquivo:** `src/main/components/CategoryChart/CategoryChart.tsx`

**O que fazer:**
1. Buscar transações do Firebase (filtradas por tipo 'expense')
2. Agrupar por categoria
3. Calcular totais
4. Atualizar gráfico
5. Usar React Query para cache

**Tempo estimado:** 1 hora

---

## 💸 FASE 4: Tela de Transferências

### ✅ PASSO 4.1: Melhorar Validações do Formulário Manual

**Arquivo:** `src/main/components/NewTransaction/ManualTransactionForm.tsx`

**O que fazer:**
1. Adicionar validação `onBlur` em todos os campos
2. Adicionar validação `onChange` para feedback imediato
3. Validações necessárias:
   - **Tipo**: obrigatório, select único
   - **Categoria**: obrigatório, select único
   - **Data**: obrigatório, não pode ser futura
   - **Valor**: obrigatório, > 0, formato monetário válido
4. Mostrar mensagens de erro abaixo de cada campo
5. Desabilitar botão "Cadastrar" se houver erros

**Tempo estimado:** 2 horas

---

### ✅ PASSO 4.2: Melhorar Validação de CSV Upload

**Arquivo:** `src/main/components/CSVUpload/CSVUpload.tsx`

**O que fazer:**
1. Validar formato do arquivo (apenas CSV)
2. Validar estrutura do CSV (4 colunas)
3. Validar cada linha:
   - Tipo: "Receita" ou "Despesa"
   - Valor: número > 0
   - Categoria: não vazio
   - Data: formato válido
4. Mostrar erros específicos por linha
5. Listar todas as linhas com erro
6. Não permitir cadastro se houver erros

**Tempo estimado:** 2 horas

---

### ✅ PASSO 4.3: Implementar POST de Transação no Firebase

**Arquivo:** `src/main/hooks/useTransactionForm.ts` e repositórios

**O que fazer:**
1. Criar transação no Firestore
2. Atualizar saldo do usuário (incrementar/decrementar)
3. Após sucesso:
   - Invalidar cache do React Query
   - Atualizar store do Zustand
   - Recarregar dados (GET)
4. Mostrar feedback de sucesso/erro

**Estrutura do documento:**
```typescript
{
  id: string (auto),
  userId: string,
  type: 'income' | 'expense',
  category: string,
  value: number,
  date: string (ISO),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Tempo estimado:** 2 horas

---

### ✅ PASSO 4.4: Ajustar Botões Limpar e Cadastrar

**Arquivo:** `src/main/components/NewTransaction/NewTransaction.tsx`

**O que fazer:**
1. **Botão Limpar**: sempre habilitado, limpa formulário e CSV
2. **Botão Cadastrar**: 
   - Habilitado apenas quando todos os campos válidos
   - Desabilitado durante loading
   - Mostrar loading durante POST

**Tempo estimado:** 30 minutos

---

## 📊 FASE 5: Extrato

### ✅ PASSO 5.1: Implementar Edição de Transação

**Arquivo:** `src/main/components/Statement/` (criar modal de edição)

**O que fazer:**
1. Criar componente `EditTransactionModal.tsx`
2. Modal com os mesmos campos do formulário manual
3. Preencher com dados da transação selecionada
4. Aplicar mesmas validações do cadastro
5. Implementar PUT no Firebase
6. Após sucesso: invalidar cache, atualizar store, recarregar

**Tempo estimado:** 2-3 horas

---

### ✅ PASSO 5.2: Implementar Exclusão de Transação

**Arquivo:** `src/main/components/Statement/` (criar modal de confirmação)

**O que fazer:**
1. Criar componente `DeleteTransactionModal.tsx`
2. Modal de confirmação
3. Implementar DELETE no Firebase
4. Atualizar saldo do usuário (reverter transação)
5. Após sucesso: invalidar cache, atualizar store, recarregar

**Tempo estimado:** 1 hora

---

### ✅ PASSO 5.3: Melhorar Filtros (Frontend)

**Arquivo:** `src/main/components/Statement/FilterModal/FilterModal.tsx`

**O que fazer:**
1. Manter filtros no frontend (já implementado)
2. Garantir que funciona com dados do Firebase
3. Testar performance com muitos registros
4. Otimizar se necessário

**Tempo estimado:** 30 minutos

---

### ✅ PASSO 5.4: Implementar Scroll Infinito Otimizado

**Arquivo:** `src/main/components/Statement/Statement.tsx`

**O que fazer:**
1. Usar paginação do Firestore (startAfter, limit)
2. Carregar mais dados do Firebase conforme scroll
3. Integrar com `useInfiniteScroll` existente
4. Otimizar para não carregar tudo de uma vez

**Tempo estimado:** 2 horas

---

## 💰 FASE 6: Investimentos

### ✅ PASSO 6.1: Criar Estrutura de Dados de Investimentos

**Arquivo:** `src/domain/entities/Investment.ts` (novo)

**Estrutura:**
```typescript
{
  id: string,
  userId: string,
  type: 'renda_fixa' | 'renda_variavel',
  value: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Tempo estimado:** 15 minutos

---

### ✅ PASSO 6.2: Implementar Card de Total e Gráfico

**Arquivo:** `src/main/components/Investments/Investments.tsx`

**O que fazer:**
1. Buscar investimentos do Firebase
2. Calcular total, renda fixa e renda variável
3. Atualizar gráfico com dados reais
4. Usar React Query para cache

**Tempo estimado:** 1-2 horas

---

### ✅ PASSO 6.3: Implementar Formulário de Investimento

**Arquivo:** `src/main/components/Investments/Investments.tsx` (criar componente)

**O que fazer:**
1. Criar formulário similar ao de transações
2. Campos: Tipo (renda fixa/variável), Valor
3. Mesmas validações do formulário de transações
4. Suporte a entrada manual e CSV
5. Formato CSV: `tipo,valor` (ex: `Renda Fixa,5000.00`)

**Tempo estimado:** 2-3 horas

---

### ✅ PASSO 6.4: Implementar POST de Investimento

**O que fazer:**
1. Criar investimento no Firestore
2. Após sucesso: invalidar cache, atualizar store, recarregar
3. Atualizar gráfico automaticamente

**Tempo estimado:** 1 hora

---

## 🎨 FASE 7: Responsividade (Mobile First)

### ✅ PASSO 7.1: Auditar e Ajustar Responsividade

**Arquivos:** Todos os componentes `.module.scss`

**O que fazer:**
1. Testar em mobile (320px, 375px, 425px)
2. Testar em tablet (768px, 1024px)
3. Testar em desktop (1280px, 1920px)
4. Ajustar breakpoints conforme necessário
5. Garantir que todos os modais funcionem em mobile

**Breakpoints sugeridos:**
- Mobile: até 425px
- Tablet: 426px - 1023px
- Desktop: 1024px+

**Tempo estimado:** 3-4 horas

---

### ✅ PASSO 7.2: Otimizar Componentes para Mobile

**O que fazer:**
1. Ajustar tamanhos de fonte
2. Ajustar espaçamentos
3. Otimizar gráficos para mobile
4. Melhorar UX de formulários em mobile

**Tempo estimado:** 2-3 horas

---

## ⚡ FASE 8: Performance e Otimização

### ✅ PASSO 8.1: Configurar Lazy Loading Avançado

**Arquivo:** `vite.config.ts`

**O que fazer:**
1. Configurar chunk splitting manual
2. Separar vendor chunks
3. Lazy load de componentes pesados (gráficos, modais)
4. Preload de rotas críticas

**Tempo estimado:** 1 hora

---

### ✅ PASSO 8.2: Implementar Cache Persistido

**O que fazer:**
1. Configurar persistência do Zustand
2. Persistir estado do usuário
3. Configurar React Query com persistência (opcional)

**Tempo estimado:** 1 hora

---

### ✅ PASSO 8.3: Otimizar Re-renders

**O que fazer:**
1. Adicionar `React.memo` em componentes pesados
2. Usar `useMemo` e `useCallback` onde necessário
3. Otimizar `useReactive` hook

**Tempo estimado:** 1-2 horas

---

## 🧪 FASE 9: Testes e Ajustes Finais

### ✅ PASSO 9.1: Testar Fluxo Completo

**O que fazer:**
1. Testar cadastro → login → tela principal
2. Testar adicionar transação (manual e CSV)
3. Testar edição e exclusão
4. Testar investimentos
5. Testar logout

**Tempo estimado:** 2 horas

---

### ✅ PASSO 9.2: Corrigir Bugs e Ajustes

**O que fazer:**
1. Corrigir erros encontrados
2. Ajustar UX onde necessário
3. Melhorar mensagens de erro

**Tempo estimado:** 2-3 horas

---

## 📝 ESTRUTURA FINAL DE ARQUIVOS

```
src/
├── app/
│   ├── App.tsx (com QueryClientProvider)
│   └── router.tsx
├── domain/
│   ├── entities/
│   │   ├── BankUser.ts
│   │   ├── Transaction.ts
│   │   └── Investment.ts (novo)
│   └── usecases/
│       ├── GetUser.ts (novo)
│       ├── UpdateUser.ts (novo)
│       ├── GetTransactions.ts
│       ├── AddTransaction.ts
│       ├── UpdateTransaction.ts (novo)
│       ├── DeleteTransaction.ts
│       ├── GetInvestments.ts (novo)
│       └── AddInvestment.ts (novo)
├── infra/
│   ├── firebase/
│   │   └── firebaseClient.ts (com db)
│   ├── react-query/
│   │   ├── queryClient.ts (novo)
│   │   └── queryKeys.ts (novo)
│   ├── repositories/
│   │   ├── UserRepository.ts (novo)
│   │   ├── TransactionRepository.ts (modificado)
│   │   └── InvestmentRepository.ts (novo)
│   └── crypto/
│       └── secureStorage.ts (corrigido)
├── presentation/
│   ├── components/
│   │   └── layout/
│   │       └── RequireAuth.tsx
│   └── views/
│       ├── LoginView.tsx
│       └── DashboardView.tsx
├── viewmodels/
│   ├── auth/
│   │   └── AuthViewModel.ts (com register)
│   └── dashboard/
│       └── DashboardViewModel.ts
├── main/
│   ├── components/
│   │   ├── MainPage/
│   │   ├── Summary/
│   │   ├── CategoryChart/
│   │   ├── NewTransaction/
│   │   │   ├── ManualTransactionForm.tsx (com validações)
│   │   │   └── CSVTransactionPreview.tsx
│   │   ├── Statement/
│   │   │   ├── EditTransactionModal.tsx (novo)
│   │   │   └── DeleteTransactionModal.tsx (novo)
│   │   ├── Investments/
│   │   │   └── InvestmentForm.tsx (novo)
│   │   └── Menu/
│   │       └── Menu.tsx (com logout)
│   ├── store/
│   │   └── useStore.ts (integrado com Firebase)
│   └── hooks/
│       └── useTransactionForm.ts (com validações)
└── home/
    └── components/
        └── HomePage/
            ├── LoginModal/
            └── RegisterModal/ (integrado com Firebase)
```

---

## ⏱️ CRONOGRAMA ESTIMADO

| Fase | Tempo Estimado |
|------|----------------|
| Fase 1: Configuração Base | 6-9 horas |
| Fase 2: Autenticação | 2-3 horas |
| Fase 3: Tela Principal | 3-4 horas |
| Fase 4: Transferências | 6-7 horas |
| Fase 5: Extrato | 5-6 horas |
| Fase 6: Investimentos | 4-6 horas |
| Fase 7: Responsividade | 5-7 horas |
| Fase 8: Performance | 3-4 horas |
| Fase 9: Testes | 4-5 horas |
| **TOTAL** | **38-51 horas** |

---

## 🎯 PRIORIZAÇÃO RECOMENDADA

### Semana 1 (Crítico)
1. ✅ Fase 1 completa (Configuração Base)
2. ✅ Fase 2 completa (Autenticação)
3. ✅ Fase 3 completa (Tela Principal)

### Semana 2 (Importante)
4. ✅ Fase 4 completa (Transferências)
5. ✅ Fase 5 completa (Extrato)

### Semana 3 (Completar)
6. ✅ Fase 6 completa (Investimentos)
7. ✅ Fase 7 completa (Responsividade)
8. ✅ Fase 8 completa (Performance)
9. ✅ Fase 9 completa (Testes)

---

## 📌 CHECKLIST DE IMPLEMENTAÇÃO

### Arquitetura
- [ ] Firestore configurado
- [ ] React Query implementado
- [ ] Repositórios criados
- [ ] Use Cases implementados
- [ ] Clean Architecture aplicada

### Features
- [ ] Landing Page
- [ ] Login com Firebase
- [ ] Cadastro com Firebase
- [ ] Tela Principal com GET do usuário
- [ ] Card com nome do usuário
- [ ] Saldo do Firebase
- [ ] Gráfico de gastos por categoria
- [ ] Transferências (manual e CSV)
- [ ] Validações completas
- [ ] POST de transação
- [ ] Edição de transação (PUT)
- [ ] Exclusão de transação (DELETE)
- [ ] Filtros
- [ ] Scroll infinito
- [ ] Investimentos (GET, POST)
- [ ] Gráfico de investimentos
- [ ] Logout no menu

### Performance
- [ ] Lazy loading configurado
- [ ] Cache implementado
- [ ] Re-renders otimizados
- [ ] Bundle otimizado

### Responsividade
- [ ] Mobile (320px - 425px)
- [ ] Tablet (426px - 1023px)
- [ ] Desktop (1024px+)

### Segurança
- [ ] Chave de criptografia corrigida
- [ ] Validações de formulário
- [ ] Autenticação segura

---

## 🚀 PRÓXIMOS PASSOS IMEDIATOS

1. **Começar pela Fase 1.1** - Configurar Firestore (crítico)
2. **Fase 1.2** - Implementar React Query
3. **Fase 1.3** - Refatorar Store
4. **Fase 1.4** - Criar Repositórios
5. **Fase 1.5** - Criar Use Cases

Depois disso, seguir sequencialmente pelas outras fases.

---

**Boa sorte na implementação! 🎉**

